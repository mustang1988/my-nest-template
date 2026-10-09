import { Logger } from 'winston';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { createClient, RedisClientType } from '@redis/client';
import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { EventType, IRedisEventMessage } from '../interface/redis-event-message.interface';
import { IRedisConfiguration } from '../../configuration/interface/redis-configuration.interface';

/**
 * Redis事件订阅监听服务
 */
@Injectable()
export class RedisEventListenerService implements OnModuleInit, OnModuleDestroy {
  /**
   * Redis事件订阅客户端
   */
  private readonly subscriber: RedisClientType;

  /**
   * Redis事件订阅通道
   */
  private readonly channel: string;

  constructor(
    @Inject() private readonly eventEmitter: EventEmitter2,
    @Inject() private readonly configService: ConfigService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {
    this.logger = this.logger.child({ context: this.constructor.name });
    const defaultRedisConf = this.configService.getOrThrow<Required<IRedisConfiguration>>('redis.default');
    this.subscriber = createClient({
      socket: {
        host: defaultRedisConf.host,
        port: defaultRedisConf.port,
      },
      username: defaultRedisConf.username,
      password: defaultRedisConf.password,
      database: defaultRedisConf.db,
    });
    this.channel = defaultRedisConf.eventChannel;
  }

  async onModuleDestroy() {
    await this.subscriber.unsubscribe();
    this.subscriber.destroy();
  }

  async onModuleInit() {
    await this.subscriber.connect();
    await this.subscriber.subscribe(this.channel, (message: string, channel: string) => {
      this.logger.debug('Redis事件订阅, 收到订阅消息: channel = %s, message = %j', channel, message);
      try {
        const jsonMessage = JSON.parse(message) as Required<IRedisEventMessage<EventType, unknown>>;
        const { event, payload, target, requestId } = jsonMessage;
        /**
         * 如果事件发送方制定了事件处理的实例ID, 则检查被指定实例是否为当前实例, 如果不是, 则不做处理
         */
        if (target !== undefined) {
          const currentInstanceId = Number(process.env.INSTANCE_ID ?? 0);
          if (currentInstanceId !== target) {
            this.logger.info('Redis事件订阅, 目标实例不匹配: expect = %s, currentInstanceId = %s', target, currentInstanceId);
            return;
          }
        }
        const emitRes = this.eventEmitter.emit(event, payload);
        this.logger.info('[%s] Redis事件订阅, 事件已处理: event = %s, payload = %j, emitRes = %s', requestId, event, payload, emitRes);
      } catch (error) {
        this.logger.error('Redis事件订阅, 事件消息格式无效: error = %o', error);
      }
    });
    this.logger.info('Redis事件监听启动: channel = %s', this.channel);
  }
}
