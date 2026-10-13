import { Module } from '@nestjs/common';
import { RedisModule } from './redis/redis.module';
import { MySQLModule } from './mysql/mysql.module';
import { LoggerModule } from './logger/logger.module';
import { CommonModule } from './common/common.module';
import { SampleModule } from './sample/sample.module';
import { ContextModule } from './context/context.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { RabbitmqModule } from './rabbitmq/rabbitmq.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConfigurationModule } from './configuration/configuration.module';
import { IRedisConfiguration } from './configuration/interface/redis-configuration.interface';
import { IMySQLConfiguration } from './configuration/interface/mysql-configuration.interface';
import { InternationalizationModule } from './internationalization/internationalization.module';
import { IRabbitmqConfiguration } from './configuration/interface/rabbitmq-configuration.interface';

@Module({
  imports: [
    // #region 全局模块
    CommonModule,
    LoggerModule,
    ContextModule,
    ConfigurationModule,
    InternationalizationModule,
    EventEmitterModule.forRoot({ global: true, inheritRequestContextId: true }),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      names: ['default'],
      useFactory: (configService: ConfigService) => {
        const redisConfig = configService.getOrThrow<Record<string, IRedisConfiguration>>('redis');
        return Object.keys(redisConfig).map((name) => ({ name, ...redisConfig[name] }));
      },
    }),
    MySQLModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      names: ['default'],
      useFactory: (configService: ConfigService) => {
        const mysqlConfig = configService.getOrThrow<Record<string, Required<IMySQLConfiguration>>>('mysql');
        return Object.keys(mysqlConfig).map((name) => ({ name, ...mysqlConfig[name] }));
      },
    }),
    RabbitmqModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      names: ['default'],
      useFactory: (configService: ConfigService) => {
        const rmqConfig = configService.getOrThrow<Record<string, Required<IRabbitmqConfiguration>>>('rabbitmq');
        return Object.keys(rmqConfig).map((name) => ({ name, ...rmqConfig[name] }));
      },
    }),
    // #endregion

    SampleModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
