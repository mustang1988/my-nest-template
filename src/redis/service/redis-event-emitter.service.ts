import { Logger } from 'winston';
import { ClsService } from 'nestjs-cls';
import { ConfigService } from '@nestjs/config';
import type { RedisClientType } from '@redis/client';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { REDIS_CLIENTS_TOKEN } from '../redis.constant';
import { CLS_REQUEST_ID } from '../../common/common.constant';
import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { IRedisEventEmitOptions } from '../interface/redis-event-emit-options.interface';
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
    @Inject(REDIS_CLIENTS_TOKEN) private readonly redisClientsMap: Map<string, RedisClientType>,
  ) {
    this.logger = this.logger.child({ context: this.constructor.name });
    this.channel = this.configService.getOrThrow<string>('redis.default.eventChannel');
  }

  /**
   * 发布Redis事件
   * @param payload 事件消息
   * @return 订阅事件的实例数量
   */
  async emit<E extends EventType, P>(event: E, payload: P, options?: IRedisEventEmitOptions): Promise<number | Array<number>> {
    const requestId = this.cls.get(CLS_REQUEST_ID);
    /**
     * 对事件消息自动补全触发事件的请求ID和事件唯一ID
     */
    const message: IRedisEventMessage<E, P> = {
      event,
      payload,
      requestId,
      target: options?.target,
    };
    this.logger.debug('[%s] 发布Redis事件, 入参: channel = %s, message = %j', requestId, this.channel, message);

    let publishResult;
    /**
     * 有指定发布的Redis客户端
     */
    if (options?.clientName) {
      const redisClient = await this.redisClientsMap.get(options?.clientName);
      if (!redisClient) {
        throw new InternalServerErrorException('Invalid redis client name');
      }
      publishResult = await redisClient.publish(this.channel, JSON.stringify(message));
    }
    /**
     * 未指定Redis客户端
     *
     * 对所有已连接的客户端发布消息
     */
    else {
      publishResult = await Promise.all(
        Array.from(this.redisClientsMap.values()).map((redisClient) => redisClient.publish(this.channel, JSON.stringify(message))),
      );
    }

    return publishResult;
  }
}
