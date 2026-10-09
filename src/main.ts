import bytes from 'bytes';
import { Logger } from 'winston';
import { basename } from 'node:path';
import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { WINSTON_MODULE_PROVIDER, WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { JsonResponseInterceptor } from './common/interceptor/json-response.interceptor';
import { GlobalExceptionFilter } from './common/exception-filter/global.exception-filter';

void (async () => {
  /**
   * 初始化IoC容器
   */
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter({ bodyLimit: bytes('1GB') as number }));

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
   * 启动服务监听
   */
  const configService = app.get(ConfigService);
  const appPort = configService.getOrThrow<number>('app.port');
  await app.listen(appPort, '0.0.0.0');

  const logger = app.get<Logger>(WINSTON_MODULE_PROVIDER).child({ context: basename(__filename) });
  logger.info('App started: port = %s', appPort);
})();
