import { Logger } from 'winston';
import { ConfigService } from '@nestjs/config';
import type { RedisClientType } from '@redis/client';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { REDIS_SUBSCRIBERS_MAP_TOKEN } from '../redis.constant';
import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { EventType, IRedisEventMessage } from '../interface/redis-event-message.interface';
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
    @Inject() private readonly eventEmitter: EventEmitter2,
    @Inject() private readonly configService: ConfigService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
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
    Array.from(this.redisSubscribers.values()).map((redisSubscriber) => redisSubscriber.destroy());
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
            const jsonMessage = JSON.parse(message) as Required<IRedisEventMessage<EventType, unknown>>;
            const { event, payload, target, requestId } = jsonMessage;
            /**
             * 如果事件发送方制定了事件处理的实例ID, 则检查被指定实例是否为当前实例, 如果不是, 则不做处理
             */
            if (target !== undefined) {
              const currentInstanceId = Number(process.env.INSTANCE_ID ?? 0);
              if (currentInstanceId !== target) {
                this.logger.info('Redis事件订阅, 目标实例非当前实例: expect = %s, currentInstanceId = %s', target, currentInstanceId);
                return;
              }
            }
            const emitRes = this.eventEmitter.emit(event, payload, { requestId });
            this.logger.info('[%s] Redis事件订阅, 事件已处理: event = %s, payload = %j, emitRes = %s', requestId, event, payload, emitRes);
          } catch (error) {
            this.logger.error('Redis事件订阅, 事件消息格式无效: error = %o', error);
          }
        }),
      ),
    );
    this.logger.info('Redis事件订阅启动: channel = %s', this.channelMap);
  }
}
