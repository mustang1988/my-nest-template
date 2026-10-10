import { Global, Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { redisClients } from './service/redis-client.service';
import { RedisEventEmitterService } from './service/redis-event-emitter.service';
import { RedisEventListenerService } from './service/redis-event-listener.service';

/**
 * Redis模块
 *
 * - 全局模块
 */
@Global()
@Module({
  imports: [EventEmitterModule.forRoot({ global: true, inheritRequestContextId: true })],
  providers: [RedisEventEmitterService, RedisEventListenerService, ...redisClients],
  exports: [RedisEventEmitterService, ...redisClients],
})
export class RedisModule {}
