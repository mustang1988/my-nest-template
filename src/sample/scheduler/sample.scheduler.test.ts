import ms from 'ms';
import { basename } from 'node:path';
import { Test } from '@nestjs/testing';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { SampleModule } from '../sample.module';
import { ScheduleModule } from '@nestjs/schedule';
import { EventModule } from 'src/event/event.module';
import { MySQLModule } from 'src/mysql/mysql.module';
import { RedisModule } from 'src/redis/redis.module';
import { SampleScheduler } from './sample.scheduler';
import { CommonModule } from 'src/common/common.module';
import { LoggerModule } from 'src/logger/logger.module';
import { ContextModule } from 'src/context/context.module';
import { RabbitmqModule } from 'src/rabbitmq/rabbitmq.module';
import { S3StorageModule } from 'src/s3-storage/s3-storage.module';
import { ConfigurationModule } from 'src/configuration/configuration.module';
import { IS3StorageConfiguration } from 'src/configuration/interface/s3-storage.interface';
import { IMySQLConfiguration } from 'src/configuration/interface/mysql-configuration.interface';
import { IRedisConfiguration } from 'src/configuration/interface/redis-configuration.interface';
import { InternationalizationModule } from 'src/internationalization/internationalization.module';
import { IRabbitmqConfiguration } from 'src/configuration/interface/rabbitmq-configuration.interface';

describe(basename(__filename), () => {
  let sampleScheduler: SampleScheduler;

  beforeAll(async () => {
    const sampleModule = await Test.createTestingModule({
      imports: [
        SampleModule,
        ScheduleModule.forRoot({ cronJobs: true, intervals: true, timeouts: true }),
        HttpModule.register({ global: true, timeout: ms('5min') }),
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
    sampleScheduler = sampleModule.get(SampleScheduler);
  });

  it('handleSampleCronJob()', async () => {
    try {
      await sampleScheduler.handleSampleCronJob();
    } catch (error) {
      console.log(error);
      expect(error).toStrictEqual(undefined);
    }
  });

  it('handleIntervalJob()', async () => {
    try {
      await sampleScheduler.handleIntervalJob();
    } catch (error) {
      expect(error).toStrictEqual(undefined);
    }
  });

  it('handleTimeoutJob()', async () => {
    try {
      await sampleScheduler.handleTimeoutJob();
    } catch (error) {
      expect(error).toStrictEqual(undefined);
    }
  });
});
