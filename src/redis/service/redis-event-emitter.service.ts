import { Logger } from 'winston';
import { ClsService } from 'nestjs-cls';
import { randomUUID } from 'node:crypto';
import { ConfigService } from '@nestjs/config';
import { Inject, Injectable } from '@nestjs/common';
import type { RedisClientType } from '@redis/client';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { DEFAULT_REDIS_CLIENT } from '../redis.constant';
import { CLS_REQUEST_ID } from '../../common/common.constant';
import { EventType, IRedisEventMessage } from '../interface/redis-event-message.interface';

/**
 * Redis事件发布服务
 *
 * 通过Redis的PUB/SUB实现NestJS原有@nestjs/event-emitter在多实例部署下无法做到的跨实例事件委托
 */
@Injectable()
export class RedisEventEmitterService {
  /**
   * Redis事件发布通道
   */
  private readonly channel: string;

  constructor(
    @Inject() private readonly cls: ClsService,
    @Inject() private readonly configService: ConfigService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    @Inject(DEFAULT_REDIS_CLIENT) private defaultRedisClient: RedisClientType,
  ) {
    this.logger = this.logger.child({ context: this.constructor.name });
    this.channel = this.configService.getOrThrow<string>('redis.default.eventChannel');
  }

  /**
   * 发布Redis事件
   * @param message 事件消息
   * @return 订阅事件的实例数量
   */
  async emit<E extends EventType, P>(message: IRedisEventMessage<E, P>): Promise<number> {
    const requestId = this.cls.get(CLS_REQUEST_ID);
    /**
     * 对事件消息自动补全触发事件的请求ID和事件唯一ID
     */
    message.requestId = message.requestId ?? requestId;
    message.eventId = message.eventId ?? randomUUID();
    this.logger.debug('[%s] 发布Redis事件, 入参: channel = %s, message = %j', requestId, this.channel, message);
    return await this.defaultRedisClient.publish(this.channel, JSON.stringify(message));
  }
}
