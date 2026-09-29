import { Module } from '@nestjs/common';
import { RedisModule } from './redis/redis.module';
import { MySQLModule } from './mysql/mysql.module';
import { LoggerModule } from './logger/logger.module';
import { CommonModule } from './common/common.module';
import { ContextModule } from './context/context.module';
import { ConfigurationModule } from './configuration/configuration.module';

@Module({
  imports: [ConfigurationModule, LoggerModule, ContextModule, CommonModule, RedisModule, MySQLModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
