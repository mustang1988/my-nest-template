import { ConfigService } from '@nestjs/config';
import { Global, Module } from '@nestjs/common';
import { DEFAULT_REDIS_CLIENT } from './redis.constant';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { createClient, RedisClientType } from '@redis/client';
import { RedisEventEmitterService } from './service/redis-event-emitter.service';
import { RedisEventListenerService } from './service/redis-event-listener.service';
import { IRedisConfiguration } from '../configuration/interface/redis-configuration.interface';

@Global()
@Module({
  imports: [EventEmitterModule.forRoot({})],
  providers: [
    {
      provide: DEFAULT_REDIS_CLIENT,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService): Promise<RedisClientType> => {
        const defaultRedisConf = configService.getOrThrow<IRedisConfiguration>('redis.default');
        const defaultRedisClient = createClient({
          socket: {
            host: defaultRedisConf.host,
            port: defaultRedisConf.port,
          },
          username: defaultRedisConf.username,
          password: defaultRedisConf.password,
          database: defaultRedisConf.db,
        });
        return await defaultRedisClient.connect();
      },
    },
    RedisEventEmitterService,
    RedisEventListenerService,
  ],
  exports: [RedisEventEmitterService],
})
export class RedisModule {}
