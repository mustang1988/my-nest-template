import bytes from 'bytes';
import { Logger } from 'winston';
import { basename } from 'node:path';
import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import fastifyHelmet from '@fastify/helmet';
import fastifyCookie from '@fastify/cookie';
import { ConfigService } from '@nestjs/config';
import fastifyCompress from '@fastify/compress';
import { I18nValidationPipe } from 'nestjs-i18n';
import fastifyMultipart from '@fastify/multipart';
import { DataMaskingUtil } from './common/util/data-masking.util';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { RedisSocketIoAdapter } from './websocket/adapter/redis-socket-io.adapter';
import { WINSTON_MODULE_PROVIDER, WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { PerformanceInterseptor } from './common/interceptor/performance.interceptor';
import { JsonResponseInterceptor } from './common/interceptor/json-response.interceptor';
import { GlobalExceptionFilter } from './common/exception-filter/global.exception-filter';
import { RequestLoggerInterceptor } from './common/interceptor/request-logger.interceptor';
import { IRabbitmqConfiguration } from './configuration/interface/rabbitmq-configuration.interface';

void (async () => {
  /**
   * 初始化IoC容器
   */
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ bodyLimit: bytes('1GB') as number, trustProxy: true }),
  );
  const logger = app.get<Logger>(WINSTON_MODULE_PROVIDER).child({ context: basename(__filename) });
  const configService = app.get(ConfigService);

  /**
   * 替换全局日志为winston
   */
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  /**
   * 注册fastify-helmet插件
   *
   * HTTP响应自动添加安全相关响应头
   */
  await app.register(fastifyHelmet);

  /**
   * 注册fastify-compression插件
   *
   * 用来支持请求响应的压缩
   */
  await app.register(fastifyCompress);

  /**
   * 注册fastify-cookie插件
   *
   * 用来支持获取请求Cookie
   */
  await app.register(fastifyCookie);

  /**
   * 注册fastify-multipart插件
   *
   * 用来支持文件上传请求
   */
  await app.register(fastifyMultipart);

  /**
   * 全局拦截器注册
   *
   * - JSON响应格式化拦截器
   * - 性能指标拦截器
   * - 请求日志拦截器
   *
   * 注意: 多个拦截器注册时需要注意注册顺序; 注册顺序影响执行顺序
   */
  app.useGlobalInterceptors(app.get(JsonResponseInterceptor), app.get(PerformanceInterseptor), app.get(RequestLoggerInterceptor));

  /**
   * 全局管道注册
   *
   * - 国际化参数校验错误处理管道
   *
   * 注意: 多个管道注册时需要注意注册顺序; 注册顺序影响执行顺序
   */
  app.useGlobalPipes(new I18nValidationPipe());

  /**
   * 全局异常过滤器注册
   *
   * - 国际化参数校验异常过滤器
   * - 全局异常过滤器
   *
   * 注意: 多异常过滤器注册时需要注意注册顺序; 注册顺序影响执行顺序
   */
  app.useGlobalFilters(app.get(GlobalExceptionFilter));

  /**
   * 设置Socket.IO适配器
   */
  const redisSocketIoAdapter = new RedisSocketIoAdapter(app);
  await redisSocketIoAdapter.connectToRedis();
  app.useWebSocketAdapter(redisSocketIoAdapter);

  /**
   * Rabbitmq队列消费
   *
   * 对rabbitmq配置中, `consume`配置项为true的队列启动消费监听
   */
  const rabbitmqConfig = configService.get<Record<string, Required<IRabbitmqConfiguration>>>('rabbitmq');
  if (rabbitmqConfig) {
    Object.values(rabbitmqConfig)
      // 只对consume配置为true的Rabbitmq创建消费
      .filter((rmqConfig) => rmqConfig.consume)
      .forEach((rmqConfig) => {
        const { username, password, host, port, vhost, queue, prefetchCount, noAck } = rmqConfig;
        logger.info('Rabbitmq队列消费: options = %j', DataMaskingUtil.maskingObject(rmqConfig, { fields: ['username', 'password'] }));
        app.connectMicroservice<MicroserviceOptions>({
          transport: Transport.RMQ,
          options: {
            urls: [{ protocol: 'amqp', hostname: host, port, username, password, vhost }],
            queue,
            prefetchCount: prefetchCount,
            noAck,
            persistent: true,
            queueOptions: { durable: true },
          },
        });
      });
    /**
     * 启动所有队列消费
     */
    await app.startAllMicroservices();
    logger.info('队列消费启动');
  }

  /**
   * 启动服务监听
   */
  const appPort = configService.getOrThrow<number>('app.port');
  await app.listen(appPort, '0.0.0.0');
  logger.info('服务启动完成: port = %s', appPort);
})();
