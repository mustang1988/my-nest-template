import ms from 'ms';
import { basename } from 'node:path';
import { Test } from '@nestjs/testing';
import { EventModule } from '@pgu/event';
import { MySQLModule } from '@pgu/mysql';
import { RedisModule } from '@pgu/redis';
import { CqrsModule } from '@nestjs/cqrs';
import { HttpModule } from '@nestjs/axios';
import { CommonModule } from '@pgu/common';
import { LoggerModule } from '@pgu/logger';
import { ContextModule } from '@pgu/context';
import { SampleModule } from './sample.module';
import { ConfigService } from '@nestjs/config';
import { RabbitmqModule } from '@pgu/rabbitmq';
import { ScheduleModule } from '@nestjs/schedule';
import { S3StorageModule } from '@pgu/s3-storage';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { InternationalizationModule } from '@pgu/internationalization';
import { ConfigurationModule, IRedisConfiguration, IMySQLConfiguration, IRabbitmqConfiguration, IS3StorageConfiguration } from '@pgu/configuration';

describe(basename(__filename), () => {
  it('constructor()', async () => {
    const sampleModule = await Test.createTestingModule({
      imports: [
        SampleModule,
        ScheduleModule.forRoot({ cronJobs: true, intervals: true, timeouts: true }),
        HttpModule.register({ global: true, timeout: ms('5min') }),
        EventEmitterModule.forRoot({ global: true }),
        CqrsModule.forRoot(),
        EventModule,
        CommonModule,
        LoggerModule,
        ContextModule,
        ConfigurationModule,
        InternationalizationModule,
        RedisModule.forRootAsync({
          useFactory: (configService: ConfigService) => {
            const redisConfig = configService.getOrThrow<Record<string, IRedisConfiguration>>('redis');
            return Object.keys(redisConfig).map((name) => ({ name, ...redisConfig[name] }));
          },
        }),
        MySQLModule.forRootAsync({
          useFactory: (configService: ConfigService) => {
            const mysqlConfig = configService.getOrThrow<Record<string, Required<IMySQLConfiguration>>>('mysql');
            return Object.keys(mysqlConfig).map((name) => ({ name, ...mysqlConfig[name] }));
          },
        }),
        RabbitmqModule.forRootAsync({
          useFactory: (configService: ConfigService) => {
            const rmqConfig = configService.getOrThrow<Record<string, Required<IRabbitmqConfiguration>>>('rabbitmq');
            return Object.keys(rmqConfig).map((name) => ({ name, ...rmqConfig[name] }));
          },
        }),
        S3StorageModule.forRootAsync({
          useFactory: (configService: ConfigService) => {
            const s3Config = configService.getOrThrow<Record<string, IS3StorageConfiguration>>('s3Storage');
            return Object.keys(s3Config).map((name) => ({ name, ...s3Config[name] }));
          },
        }),
      ],
    }).compile();
    expect(sampleModule);
  });
});
