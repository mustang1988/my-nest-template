import request from 'supertest';
import { AppModule } from 'src/app.module';
import { Test, TestingModule } from '@nestjs/testing';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

describe('AppController (e2e)', () => {
  let app: NestFastifyApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = app = moduleFixture.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
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
