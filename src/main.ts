import bytes from 'bytes';
import { Logger } from 'winston';
import { basename } from 'node:path';
import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import compression from '@fastify/compress';
import fastifyCookie from '@fastify/cookie';
import { ConfigService } from '@nestjs/config';
import { DataMaskingUtil } from './common/util/data-masking.util';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { WINSTON_MODULE_PROVIDER, WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { JsonResponseInterceptor } from './common/interceptor/json-response.interceptor';
import { GlobalExceptionFilter } from './common/exception-filter/global.exception-filter';
import { IRabbitmqConfiguration } from './configuration/interface/rabbitmq-configuration.interface';

void (async () => {
  /**
   * 初始化IoC容器
   */
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter({ bodyLimit: bytes('1GB') as number }));
  const logger = app.get<Logger>(WINSTON_MODULE_PROVIDER).child({ context: basename(__filename) });
  const configService = app.get(ConfigService);

  /**
   * 注册fastify-compression插件
   */
  await app.register(compression);

  /**
   * 注册fastify-cookie插件  
   */
  await app.register(fastifyCookie);

  /**
   * 替换全局日志为winston
   */
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  /**
   * 全局拦截器注册
   */
  app.useGlobalInterceptors(app.get(JsonResponseInterceptor));

  /**
   * 全局管道注册
   */
  app.useGlobalPipes(new I18nValidationPipe());

  /**
   * 全局异常过滤器注册
   *
   * 注意: 多异常过滤器注册时需要注意注册顺序
   */
  app.useGlobalFilters(new I18nValidationExceptionFilter({ detailedErrors: false }), app.get(GlobalExceptionFilter));

  /**
   * Rabbitmq队列消费
   */
  const rabbitmqConfig = configService.get<Record<string, Required<IRabbitmqConfiguration>>>('rabbitmq');
  if (rabbitmqConfig) {
    Object.values(rabbitmqConfig)
      .filter((rmqConfig) => rmqConfig.consume)
      .forEach((rmqConfig) => {
        const { username, password, host, port, vhost, queue, prefetchCount, noAck } = rmqConfig;
        logger.info('Rabbitmq队列消费: rmqConfig = %j', DataMaskingUtil.maskingObject(rmqConfig, { fields: ['username', 'password'] }));
        app.connectMicroservice<MicroserviceOptions>({
          transport: Transport.RMQ,
          options: {
            urls: [
              {
                protocol: 'amqp',
                hostname: host,
                port,
                username,
                password,
                vhost,
              },
            ],
            queue,
            prefetchCount: prefetchCount,
            noAck,
            persistent: true,
            queueOptions: {
              durable: true,
            },
          },
        });
      });
    /**
     * 启动队列消费
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
