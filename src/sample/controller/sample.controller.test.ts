import bytes from 'bytes';
import request from 'supertest';
import { DataSource } from 'typeorm';
import { basename } from 'node:path';
import { faker } from '@faker-js/faker';
import { AppModule } from 'src/app.module';
import { createReadStream } from 'node:fs';
import { NestFactory } from '@nestjs/core';
// import fastifyCookie from '@fastify/cookie';
import fastifyHelmet from '@fastify/helmet';
import fastifyCompress from '@fastify/compress';
import { I18nValidationPipe } from 'nestjs-i18n';
import fastifyMultipart from '@fastify/multipart';
import { SampleEntity } from '../entity/sample.default.entity';
import { getMySQLDataSourceToken } from 'src/mysql/mysql.constant';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { PerformanceInterceptor } from 'src/common/interceptor/performance.interceptor';
import { JsonResponseInterceptor } from 'src/common/interceptor/json-response.interceptor';
import { GlobalExceptionFilter } from 'src/common/exception-filter/global.exception-filter';
import { RequestLoggerInterceptor } from 'src/common/interceptor/request-logger.interceptor';

describe(basename(__filename), () => {
  let app: NestFastifyApplication;
  let dataSource: DataSource;
  /**
   * 测试过程中创建的示例数据ID, 用于测试结束后清理
   */
  const createdSampleIds: Array<number> = [];

  beforeEach(async () => {
    app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter({ bodyLimit: bytes('1GB') as number, trustProxy: true }));
    await app.register(fastifyHelmet);
    await app.register(fastifyCompress);
    // await app.register(fastifyCookie);
    await app.register(fastifyMultipart);
    app.useGlobalInterceptors(app.get(JsonResponseInterceptor), app.get(PerformanceInterceptor), app.get(RequestLoggerInterceptor));
    app.useGlobalPipes(new I18nValidationPipe());
    app.useGlobalFilters(app.get(GlobalExceptionFilter));

    await app.init();
    await app.getHttpAdapter().getInstance().ready();
    dataSource = app.get<DataSource>(getMySQLDataSourceToken('default'));
  });

  describe('GET /api/sample', () => {
    it('缺少必须参数', async () => {
      const response = await request(app.getHttpServer()).get('/api/sample');
      expect(response.statusCode).toStrictEqual(400);
    });

    it('可选参数格式错误', async () => {
      const response = await request(app.getHttpServer()).get(`/api/sample?sample_foo=${faker.lorem.word()}&sample_bar=${faker.lorem.word()}`);
      expect(response.statusCode).toStrictEqual(400);
    });

    it('正常', async () => {
      const response = await request(app.getHttpServer()).get(
        `/api/sample?sample_foo=${faker.lorem.word()}&sample_bar=${faker.number.int({ min: 0, max: 3 })}`,
      );
      expect(response.statusCode).toStrictEqual(200);
    });
  });

  describe('GET /api/sample/:id', () => {
    it('id = 1', async () => {
      const id = 1;
      const response = await request(app.getHttpServer()).get(`/api/sample/${id}`);
      expect(response.statusCode).toStrictEqual(200);
    });

    it('id = 不存在', async () => {
      const id = faker.number.int({ min: 10, max: 100 });
      const response = await request(app.getHttpServer()).get(`/api/sample/${id}`);
      expect(response.statusCode).toStrictEqual(404);
    });

    it('id = 非数值', async () => {
      const id = faker.lorem.word();
      const response = await request(app.getHttpServer()).get(`/api/sample/${id}`);
      expect(response.statusCode).toStrictEqual(400);
    });
  });

  describe('POST /api/sample', () => {
    it('缺少必须参数', async () => {
      const response = await request(app.getHttpServer()).post('/api/sample').send({});
      expect(response.statusCode).toStrictEqual(400);
    });

    it('格式错误', async () => {
      const body = { name: faker.string.alpha({ length: 101 }) }; // name长度上限为100
      const response = await request(app.getHttpServer()).post('/api/sample').send(body);
      expect(response.statusCode).toStrictEqual(400);
    });

    it('正常', async () => {
      const body = { name: faker.lorem.word() };
      const response = await request(app.getHttpServer()).post('/api/sample').send(body);
      expect(response.statusCode).toStrictEqual(200);
      expect(response.body.data.id);
      expect(response.body.data.name).toStrictEqual(body.name);
      createdSampleIds.push(response.body.data.id);
    });
  });

  describe('GET /api/sample/detail/:id', () => {
    it('正常', async () => {
      /**
       * 先创建一条数据确保存在
       */
      const createResponse = await request(app.getHttpServer()).post('/api/sample').send({ name: faker.lorem.word() });
      expect(createResponse.statusCode).toStrictEqual(200);
      const createdId = createResponse.body.data.id as number;
      createdSampleIds.push(createdId);

      const response = await request(app.getHttpServer()).get(`/api/sample/detail/${createdId}`);
      expect(response.statusCode).toStrictEqual(200);
      expect(response.body.data.id).toStrictEqual(createdId);
    });

    it('id = 不存在', async () => {
      /**
       * 创建后删除, 确保指定ID的数据不存在
       */
      const createResponse = await request(app.getHttpServer()).post('/api/sample').send({ name: faker.lorem.word() });
      expect(createResponse.statusCode).toStrictEqual(200);
      const createdId = createResponse.body.data.id as number;
      await dataSource.getRepository(SampleEntity).delete(createdId);

      const response = await request(app.getHttpServer()).get(`/api/sample/detail/${createdId}`);
      expect(response.statusCode).toStrictEqual(404);
    });

    it('id = 非数值', async () => {
      const id = faker.lorem.word();
      const response = await request(app.getHttpServer()).get(`/api/sample/detail/${id}`);
      expect(response.statusCode).toStrictEqual(400);
    });
  });

  describe('POST /api/sample/upload', () => {
    it('非multipart请求', async () => {
      const body = new FormData();
      const response = await request(app.getHttpServer()).post('/api/sample/upload').send(body);
      expect(response.statusCode).toStrictEqual(403);
    });

    it('POST /api/sample/upload', async () => {
      const uploadFile = createReadStream(__filename);
      const response = await request(app.getHttpServer()).post('/api/sample/upload').attach('file', uploadFile);
      expect(response.statusCode).toStrictEqual(200);
    });
  });

  afterEach(async () => {
    /**
     * 清理测试创建的示例数据
     */
    if (createdSampleIds.length > 0) {
      await dataSource.getRepository(SampleEntity).delete(createdSampleIds.splice(0));
    }
    await app.close();
  });
});
