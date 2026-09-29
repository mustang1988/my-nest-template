import { Logger } from 'winston';
import { ClsService } from 'nestjs-cls';
import { Inject, Injectable } from '@nestjs/common';
import type { RedisClientType } from '@redis/client';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { CLS_REQUEST_ID } from '../../common/common.constant';
import { DEFAULT_REDIS_CHANNEL, DEFAULT_REDIS_CLIENT } from '../redis.constant';
import { EventType, IRedisEventMessage } from '../interface/redis-event-message.interface';

@Injectable()
export class RedisEventEmitterService {
  constructor(
    @Inject() private readonly cls: ClsService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    @Inject(DEFAULT_REDIS_CLIENT) private defaultRedisClient: RedisClientType,
  ) {
    this.logger = this.logger.child({ context: this.constructor.name });
  }

  async emit<E extends EventType, P>(message: IRedisEventMessage<E, P>): Promise<number> {
    const requestId = this.cls.get(CLS_REQUEST_ID);
    this.logger.debug('[%s] 发布Redis事件, 入参: message = %j', requestId, message);
    return await this.defaultRedisClient.publish(DEFAULT_REDIS_CHANNEL.toString(), JSON.stringify(message));
  }
}
