import ms from 'ms';
import { basename } from 'node:path';
import { lastValueFrom } from 'rxjs';
import { LoggerModule } from '@pgu/logger';
import { ContextModule } from '@pgu/context';
import { ConfigService } from '@nestjs/config';
import { CommonModule } from '../common.module';
import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule, HttpService } from '@nestjs/axios';
import { ConfigurationModule } from '@pgu/configuration';
import { BigintSupportResponseTransformer } from './bigint-support.response-transformer';

describe(basename(__filename), () => {
  let commonModule: TestingModule;
  let axios: HttpService;

  beforeAll(async () => {
    commonModule = await Test.createTestingModule({
      imports: [
        ConfigurationModule,
        LoggerModule,
        ContextModule,
        CommonModule,
        HttpModule.registerAsync({
          global: true,
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            timeout: configService.get<number>('constants.axios.timeout', ms('5min')),
            transformResponse: [BigintSupportResponseTransformer],
          }),
        }),
      ],
    }).compile();
    expect(commonModule);
    axios = commonModule.get(HttpService);
    expect(axios);
  });

  afterAll(async () => {
    await commonModule.close();
  });

  describe('BigintSupportResponseTransformer', () => {
    it('JSON响应', async () => {
      const url = 'http://localhost:3000/api/healthcheck';
      const response = await lastValueFrom(axios.get<unknown>(url));
      expect(response.status).toStrictEqual(200);
    });

    it('非JSON', async () => {
      const url = 'https://www.vsochina.com';
      const response = await lastValueFrom(axios.get<unknown>(url));
      expect(response.status).toStrictEqual(200);
    });

    it('非JSON', async () => {
      const url = 'http://localhost:3000/api/sample/raw';
      const response = await lastValueFrom(axios.get<unknown>(url));
      expect(response.status).toStrictEqual(200);
    });
  });
});
