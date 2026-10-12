import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisModule } from './redis/redis.module';
import { MySQLModule } from './mysql/mysql.module';
import { LoggerModule } from './logger/logger.module';
import { CommonModule } from './common/common.module';
import { SampleModule } from './sample/sample.module';
import { ContextModule } from './context/context.module';
import { RabbitmqModule } from './rabbitmq/rabbitmq.module';
import { ConfigurationModule } from './configuration/configuration.module';
import { IRedisConfiguration } from './configuration/interface/redis-configuration.interface';
import { InternationalizationModule } from './internationalization/internationalization.module';

@Module({
  imports: [
    // #region 全局模块
    ConfigurationModule,
    LoggerModule,
    ContextModule,
    CommonModule,
    RedisModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const redisConfig = configService.getOrThrow<Record<string, IRedisConfiguration>>('redis');
        return new Map<string, IRedisConfiguration>(Object.keys(redisConfig).map((key) => [key, redisConfig[key]]));
      },
    }),
    MySQLModule,
    InternationalizationModule,
    RabbitmqModule,
    // #endregion

    SampleModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
