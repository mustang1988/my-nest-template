import ms from 'ms';
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { RedisModule } from './redis/redis.module';
import { MySQLModule } from './mysql/mysql.module';
import { EventModule } from './event/event.module';
import { LoggerModule } from './logger/logger.module';
import { CommonModule } from './common/common.module';
import { SampleModule } from './sample/sample.module';
import { ContextModule } from './context/context.module';
import { RabbitmqModule } from './rabbitmq/rabbitmq.module';
import { S3StorageModule } from './s3-storage/s3-storage.module';
import { ConfigurationModule } from './configuration/configuration.module';
import { IS3StorageConfiguration } from './configuration/interface/s3-storage.interface';
import { IRedisConfiguration } from './configuration/interface/redis-configuration.interface';
import { IMySQLConfiguration } from './configuration/interface/mysql-configuration.interface';
import { InternationalizationModule } from './internationalization/internationalization.module';
import { IRabbitmqConfiguration } from './configuration/interface/rabbitmq-configuration.interface';

@Module({
  imports: [
    // #region 全局模块
    /**
     * NestJS 定时/计划任务模块
     */
    ScheduleModule.forRoot({ cronJobs: true, intervals: true, timeouts: true }),
    /**
     * NestJS HTTP客户端模块
     */
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
    // #endregion

    // #region 业务模块
    SampleModule,
    // #endregion
  ],
})
export class AppModule {}
