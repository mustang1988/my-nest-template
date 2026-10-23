import bytes from 'bytes';
import request from 'supertest';
import { basename } from 'node:path';
import { AppModule } from 'src/app.module';
import { NestFactory } from '@nestjs/core';
import fastifyHelmet from '@fastify/helmet';
import fastifyCompress from '@fastify/compress';
import { I18nValidationPipe } from 'nestjs-i18n';
import fastifyMultipart from '@fastify/multipart';
import { PerformanceInterceptor } from '../interceptor/performance.interceptor';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { JsonResponseInterceptor } from '../interceptor/json-response.interceptor';
import { GlobalExceptionFilter } from '../exception-filter/global.exception-filter';
import { RedisSocketIoAdapter } from 'src/websocket/adapter/redis-socket-io.adapter';
import { RequestLoggerInterceptor } from '../interceptor/request-logger.interceptor';

describe(basename(__filename), () => {
  let app: NestFastifyApplication;

  beforeEach(async () => {
    app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter({ bodyLimit: bytes('1GB') as number, trustProxy: true }));
    await app.register(fastifyHelmet);
    await app.register(fastifyCompress);
    // await app.register(fastifyCookie);
    await app.register(fastifyMultipart);
    app.useGlobalInterceptors(app.get(JsonResponseInterceptor), app.get(PerformanceInterceptor), app.get(RequestLoggerInterceptor));
    app.useGlobalPipes(new I18nValidationPipe());
    app.useGlobalFilters(app.get(GlobalExceptionFilter));
    const redisSocketIoAdapter = new RedisSocketIoAdapter(app);
    await redisSocketIoAdapter.connectToRedis();
    app.useWebSocketAdapter(redisSocketIoAdapter);

    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  it('GET /api/healthcheck', async () => {
    const response = await request(app.getHttpServer()).get('/api/healthcheck');
    expect(response.statusCode).toStrictEqual(200);
  });

  afterEach(async () => {
    await app.close();
  });
});
