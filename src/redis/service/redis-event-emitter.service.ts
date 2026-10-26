import { ConfigService } from '@nestjs/config';
import { Inject, Injectable } from '@nestjs/common';
import type { RedisClientType } from '@redis/client';
import { EventType } from '../../event/type/event.type';
import { BaseEvent } from '../../event/event/base.event';
import { REDIS_CLIENTS_MAP_TOKEN } from '../redis.constant';
import { AutoContextLogger } from '../../logger/auto-context-logger';
import { IRedisEventEmitOptions } from '../interface/redis-event-emit-options.interface';
import { RedisClientNotFoundException } from '../exception/redis-client-not-found.exception';
import { IRedisConfiguration } from '../../configuration/interface/redis-configuration.interface';

/**
 * Redis事件发布服务
 *
 * 通过Redis的PUB/SUB实现NestJS原有@nestjs/event-emitter在多实例部署下无法做到的跨实例事件委托
 */
@Injectable()
export class RedisEventEmitterService extends AutoContextLogger {
  /**
   * Redis事件发布通道
   */
  private readonly channelMap: Map<string, string>;

  constructor(
    private readonly configService: ConfigService,
    @Inject(REDIS_CLIENTS_MAP_TOKEN) private readonly redisClientsMap: Map<string, RedisClientType>,
  ) {
    super();
    const redisConfig = this.configService.getOrThrow<Record<string, Required<IRedisConfiguration>>>('redis');
    this.channelMap = new Map(Object.keys(redisConfig).map((name) => [name, redisConfig[name].eventChannel]));
  }

  async emit<E extends EventType, T>(event: BaseEvent<E, T>, options?: IRedisEventEmitOptions): Promise<number | Array<number>> {
    this.logger.debug('[%s] 发布Redis事件, 入参: event = %j, options = %j', event.requestId, event, options);

    let publishResult;
    if (options?.clientName) {
      const redisClient = this.redisClientsMap.get(options?.clientName);
      if (!redisClient) {
        this.logger.warn('[%s] 发布Redis事件, 指定的发布端名称无效: clientName = %s', event.requestId, options?.clientName);
        throw new RedisClientNotFoundException(options.clientName);
      }
      const channelToPublish = this.channelMap.get(options?.clientName);
      publishResult = await redisClient.publish(channelToPublish as string, event.toString());
    }
    /**
     * 未指定Redis客户端
     *
     * 对所有已连接的客户端发布消息
     */
    else {
      publishResult = await Promise.all(
        Array.from(this.redisClientsMap.entries()).map(([name, redisClient]) =>
          redisClient.publish(this.channelMap.get(name) as string, event.toString()),
        ),
      );
    }

    this.logger.debug('[%s] 发布Redis事件, 发布结果: publishResult = %j', event.requestId, publishResult);
    return publishResult;
  }
}
