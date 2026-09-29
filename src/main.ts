import bytes from 'bytes';
import { Logger } from 'winston';
import { basename } from 'node:path';
import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { WINSTON_MODULE_PROVIDER, WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { JsonResponseInterceptor } from './common/interceptor/json-response.interceptor';
import { GlobalExceptionFilter } from './common/exception-filter/global.exception-filter';

void (async () => {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter({ bodyLimit: bytes('1GB') as number }));
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  app.useGlobalInterceptors(app.get(JsonResponseInterceptor));
  app.useGlobalFilters(app.get(GlobalExceptionFilter));

  const configService = app.get(ConfigService);
  const appPort = configService.getOrThrow<number>('app.port');
  await app.listen(appPort, '0.0.0.0');

  const logger = app.get<Logger>(WINSTON_MODULE_PROVIDER).child({ context: basename(__filename) });
  logger.info('App started: port = %s', appPort);
})();
