import { Logger } from 'winston';
import { ClsService } from 'nestjs-cls';
import { ConfigService } from '@nestjs/config';
import type { RedisClientType } from '@redis/client';
import { REDIS_CLIENTS_MAP_TOKEN } from '../redis.constant';
import { CLS_REQUEST_ID } from '../../common/common.constant';
import { InjectLogger } from '../../logger/decorator/inject-logger.decorator';
import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { IRedisEventEmitOptions } from '../interface/redis-event-emit-options.interface';
import { IRedisConfiguration } from '../../configuration/interface/redis-configuration.interface';
import { BaseEvent } from '../../event/event/base.event';
import { EventType } from '../../event/type/event.type';

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
  private readonly channelMap: Map<string, string>;

  constructor(
    @Inject() private readonly cls: ClsService,
    @InjectLogger() private readonly logger: Logger,
    @Inject() private readonly configService: ConfigService,
    @Inject(REDIS_CLIENTS_MAP_TOKEN) private readonly redisClientsMap: Map<string, RedisClientType>,
  ) {
    this.logger = this.logger.child({ context: this.constructor.name });
    const redisConfig = this.configService.getOrThrow<Record<string, Required<IRedisConfiguration>>>('redis');
    this.channelMap = new Map(Object.keys(redisConfig).map((name) => [name, redisConfig[name].eventChannel]));
  }

  // /**
  //  * 发布Redis事件
  //  * @param payload 事件消息
  //  * @return 订阅事件的实例数量
  //  */
  // async emit<E extends EventType, P>(event: E, payload: P, options?: IRedisEventEmitOptions): Promise<number | Array<number>> {
  //   const requestId = this.cls.get(CLS_REQUEST_ID);
  //   this.logger.debug('[%s] 发布Redis事件, 入参: event = %s, payload = %j, options = %j', requestId, event, payload, options);
  //   /**
  //    * 对事件消息自动补全触发事件的请求ID和事件唯一ID
  //    */
  //   const message: IRedisEventMessage<E, P> = {
  //     event,
  //     payload,
  //     requestId,
  //     targetInstance: options?.instanceId,
  //   };

  //   let publishResult;
  //   /**
  //    * 有指定发布的Redis客户端
  //    */
  //   if (options?.clientName) {
  //     const redisClient = await this.redisClientsMap.get(options?.clientName);
  //     if (!redisClient) {
  //       this.logger.warn('[%s] 发布Redis事件, 指定的发布端名称无效: clientName = %s', requestId, options?.clientName);
  //       throw new InternalServerErrorException('Redis client not found');
  //     }
  //     const channelToPublish = this.channelMap.get(options?.clientName);
  //     if (!channelToPublish) {
  //       this.logger.warn('[%s] 发布Redis事件, 指定的发布通道无效: clientName = %s', requestId, options?.clientName);
  //       throw new InternalServerErrorException('Redis channel not found');
  //     }
  //     publishResult = await redisClient.publish(channelToPublish, JSON.stringify(message));
  //   }
  //   /**
  //    * 未指定Redis客户端
  //    *
  //    * 对所有已连接的客户端发布消息
  //    */
  //   else {
  //     publishResult = await Promise.all(
  //       Array.from(this.redisClientsMap.entries()).map(([name, redisClient]) =>
  //         redisClient.publish(this.channelMap.get(name) as string, JSON.stringify(message)),
  //       ),
  //     );
  //   }

  //   this.logger.debug('[%s] 发布Redis事件, 发布结果: publishResult = %j', requestId, publishResult);
  //   return publishResult;
  // }

  async emit<E extends EventType, T>(event: BaseEvent<E, T>, options?: IRedisEventEmitOptions): Promise<number | Array<number>> {
    this.logger.debug('[%s] 发布Redis事件, 入参: event = %j, options = %j', event.getRequestId(), event, options);

    let publishResult;
    if (options?.clientName) {
      const redisClient = await this.redisClientsMap.get(options?.clientName);
      if (!redisClient) {
        this.logger.warn('[%s] 发布Redis事件, 指定的发布端名称无效: clientName = %s', event.getRequestId(), options?.clientName);
        throw new InternalServerErrorException('Redis client not found');
      }
      const channelToPublish = this.channelMap.get(options?.clientName);
      if (!channelToPublish) {
        this.logger.warn('[%s] 发布Redis事件, 指定的发布通道无效: clientName = %s', event.getRequestId(), options?.clientName);
        throw new InternalServerErrorException('Redis channel not found');
      }
      publishResult = await redisClient.publish(channelToPublish, event.toJsonString());
    }
    /**
     * 未指定Redis客户端
     *
     * 对所有已连接的客户端发布消息
     */
    else {
      publishResult = await Promise.all(
        Array.from(this.redisClientsMap.entries()).map(([name, redisClient]) =>
          redisClient.publish(this.channelMap.get(name) as string, event.toJsonString()),
        ),
      );
    }

    this.logger.debug('[%s] 发布Redis事件, 发布结果: publishResult = %j', event.getRequestId(), publishResult);
    return publishResult;
  }
}
