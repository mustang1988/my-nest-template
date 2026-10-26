import { Logger } from 'winston';
import { ConfigService } from '@nestjs/config';
import type { RedisClientType } from '@redis/client';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { BaseEvent } from '../../event/event/base.event';
import { REDIS_SUBSCRIBERS_MAP_TOKEN } from '../redis.constant';
import { InjectLogger } from '../../logger/decorator/inject-logger.decorator';
import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { IRedisConfiguration } from '../../configuration/interface/redis-configuration.interface';

/**
 * Redis事件订阅监听服务
 */
@Injectable()
export class RedisEventListenerService implements OnModuleInit, OnModuleDestroy {
  /**
   * Redis事件订阅通道
   */
  private readonly channelMap: Map<string, string>;

  constructor(
    @InjectLogger() private readonly logger: Logger,
    private readonly eventEmitter: EventEmitter2,
    private readonly configService: ConfigService,
    @Inject(REDIS_SUBSCRIBERS_MAP_TOKEN) private readonly redisSubscribers: Map<string, RedisClientType>,
  ) {
    this.logger = this.logger.child({ context: this.constructor.name });
    const redisConfig = this.configService.getOrThrow<Record<string, Required<IRedisConfiguration>>>('redis');
    this.channelMap = new Map(Object.keys(redisConfig).map((name) => [name, redisConfig[name].eventChannel]));
  }

  async onModuleDestroy() {
    /**
     * 关闭所有订阅者
     */
    await Promise.all(Array.from(this.redisSubscribers.values()).map((redisSubscriber) => redisSubscriber.unsubscribe()));
    Array.from(this.redisSubscribers.values()).forEach((redisSubscriber) => redisSubscriber.destroy());
  }

  async onModuleInit() {
    /**
     * 启动所有订阅者的订阅
     */
    await Promise.all(
      Array.from(this.redisSubscribers.entries()).map(([name, redisSubscriber]) =>
        redisSubscriber.subscribe(this.channelMap.get(name) as string, (message: string, channel: string) => {
          this.logger.debug('Redis事件订阅, 收到订阅消息: name = %s, channel = %s, message = %j', name, channel, message);
          try {
            const event = BaseEvent.fromString(message);
            const emitRes = this.eventEmitter.emit(event.eventName, event);
            this.logger.info('[%s] Redis事件订阅, 事件已处理: event = %j, emitRes = %s', event.requestId, event, emitRes);
          } catch (error) {
            this.logger.error('Redis事件订阅, 事件消息格式无效: error = %o', error);
          }
        }),
      ),
    );
    this.logger.info('Redis事件订阅启动: channelMap = %o', this.channelMap);
  }
}
