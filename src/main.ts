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
import { ExceptionFilter, NestInterceptor, PipeTransform } from '@nestjs/common';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { RedisSocketIoAdapter } from './websocket/adapter/redis-socket-io.adapter';
import { WINSTON_MODULE_PROVIDER, WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { PerformanceInterceptor } from './common/interceptor/performance.interceptor';
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
    {
      /**
       * 未设置此选项或将其设置为false时
       * IoC容器初始化阶段的日志由NestJS框架自行管理, 日志只会输出到控制台并不会有落盘文件日志
       * 此选项设置为true后
       * IoC容器初始化阶段的日志会被保留在内存缓冲区中
       * 直到下面的`app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER))`被调用后再从缓冲区输出到winston
       */
      bufferLogs: true,
    },
  );
  const configService = app.get(ConfigService);
  const logger = app.get<Logger>(WINSTON_MODULE_PROVIDER).child({ context: configService.get<string>('app.title') ?? basename(__filename) });

  /**
   * 替换全局日志为winston
   */
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  logger.debug('全局logger设置完毕');

  /**
   * 注册fastify-helmet插件
   *
   * HTTP响应自动添加安全相关响应头
   */
  await app.register(fastifyHelmet);
  logger.debug('FastifyHelmet插件加载完毕');

  /**
   * 注册fastify-compression插件
   *
   * 用来支持请求响应的压缩
   */
  await app.register(fastifyCompress);
  logger.debug('FastifyCompress插件加载完毕');

  /**
   * 注册fastify-cookie插件
   *
   * 用来支持获取请求Cookie和设置响应Cookie
   */
  await app.register(fastifyCookie);
  logger.debug('FastifyCookie插件加载完毕');

  /**
   * 注册fastify-multipart插件
   *
   * 用来支持文件上传请求
   */
  await app.register(fastifyMultipart);
  logger.debug('FastifyMultipart插件加载完毕');

  /**
   * 全局拦截器注册
   *
   * - JSON响应格式化拦截器
   * - 性能指标拦截器
   * - 请求日志拦截器
   *
   * 注意: 多个拦截器注册时需要注意注册顺序; 注册顺序影响执行顺序
   */
  const globalInterceptors: Array<NestInterceptor> = [
    app.get(JsonResponseInterceptor),
    app.get(PerformanceInterceptor),
    app.get(RequestLoggerInterceptor),
  ];
  app.useGlobalInterceptors(...globalInterceptors);
  logger.debug(
    '全局拦截器注册完毕: %j',
    globalInterceptors.map((i) => i.constructor.name),
  );

  /**
   * 全局管道注册
   *
   * - 国际化参数校验错误处理管道(继承自@nestjs/common包中的ValidationPipe, 因此项目中所有的Controller中都不再需要使用ValidationPipe)
   *
   * 注意: 多个管道注册时需要注意注册顺序; 注册顺序影响执行顺序
   */
  const globalPipes: Array<PipeTransform> = [new I18nValidationPipe({ stopAtFirstError: true })];
  app.useGlobalPipes(...globalPipes);
  logger.debug(
    '全局管道注册完毕: %j',
    globalPipes.map((p) => p.constructor.name),
  );

  /**
   * 全局异常过滤器注册
   *
   * - 全局异常过滤器
   *
   * 注意: 多异常过滤器注册时需要注意注册顺序; 后注册的过滤器优先生效, 且过滤器不匹配时不会向后传递
   */
  const globalExceptionFilters: Array<ExceptionFilter> = [app.get(GlobalExceptionFilter)];
  app.useGlobalFilters(...globalExceptionFilters);
  logger.debug(
    '全局异常过滤器注册完毕: %j',
    globalExceptionFilters.map((ef) => ef.constructor.name),
  );

  /**
   * 启用优雅停机
   *
   * 收到SIGTERM等终止信号时, 依次触发各模块的onModuleDestroy等生命周期钩子
   * (Redis订阅退订, Rabbitmq连接关闭, MySQL数据源销毁等), 避免在途请求和队列消息丢失
   */
  app.enableShutdownHooks();

  /**
   * 设置RedisSocketIoAdapter作为Socket.IO适配器
   */
  const redisSocketIoAdapter = new RedisSocketIoAdapter(app);
  await redisSocketIoAdapter.connectToRedis();
  app.useWebSocketAdapter(redisSocketIoAdapter);
  logger.debug('Socket.IO适配器加载完毕');

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
            socketOptions: {
              /**
               * 断链自动重连配置(底层连接基于amqp-connection-manager)
               *
               * - heartbeatIntervalInSeconds: 心跳间隔(秒), 用于及时检测断链
               * - reconnectTimeInSeconds: 断链后重连间隔(秒), 默认与心跳间隔一致
               *
               * 断链后自动无限重连, 重连成功后自动重建channel并恢复队列消费
               */
              heartbeatIntervalInSeconds: 5,
              reconnectTimeInSeconds: 5,
            },
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
