import { Module } from '@nestjs/common';
import { RedisModule } from './redis/redis.module';
import { MySQLModule } from './mysql/mysql.module';
import { LoggerModule } from './logger/logger.module';
import { CommonModule } from './common/common.module';
import { SampleModule } from './sample/sample.module';
import { ContextModule } from './context/context.module';
import { RabbitmqModule } from './rabbitmq/rabbitmq.module';
import { ConfigurationModule } from './configuration/configuration.module';
import { InternationalizationModule } from './internationalization/internationalization.module';

@Module({
  imports: [
    // #region 全局模块
    ConfigurationModule,
    LoggerModule,
    ContextModule,
    CommonModule,
    RedisModule,
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
