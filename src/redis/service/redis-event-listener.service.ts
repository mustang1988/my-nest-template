import { Logger } from 'winston';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { DEFAULT_REDIS_CHANNEL } from '../redis.constant';
import { createClient, RedisClientType } from '@redis/client';
import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { EventType, IRedisEventMessage } from '../interface/redis-event-message.interface';
import { IRedisConfiguration } from '../../configuration/interface/redis-configuration.interface';

@Injectable()
export class RedisEventListenerService implements OnModuleInit, OnModuleDestroy {
  private readonly subscriber: RedisClientType;

  constructor(
    @Inject() private readonly eventEmitter: EventEmitter2,
    @Inject() private readonly configService: ConfigService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {
    this.logger = this.logger.child({ context: this.constructor.name });
    const defaultRedisConf = this.configService.getOrThrow<IRedisConfiguration>('redis.default');
    this.subscriber = createClient({
      socket: {
        host: defaultRedisConf.host,
        port: defaultRedisConf.port,
      },
      username: defaultRedisConf.username,
      password: defaultRedisConf.password,
      database: defaultRedisConf.db,
    });
  }

  async onModuleDestroy() {
    await this.subscriber.unsubscribe();
    this.subscriber.destroy();
  }

  async onModuleInit() {
    await this.subscriber.connect();
    await this.subscriber.subscribe(DEFAULT_REDIS_CHANNEL.toString(), (message: string, channel: string) => {
      this.logger.debug('Redis event subscriber got message: channel = %s, message = %j', channel, message);
      try {
        const jsonMessage = JSON.parse(message) as IRedisEventMessage<EventType, unknown>;
        const { event, payload } = jsonMessage;
        const emitRes = this.eventEmitter.emit(event, payload);
        this.logger.info('Redis event subscriber handled: event = %s, payload = %j, emitRes = %s', event, payload, emitRes);
      } catch (error) {
        this.logger.error('Redis event subscriber, invalid message: error = %o', error);
      }
    });
    this.logger.info('Redis event subscriber start: channel = %s', DEFAULT_REDIS_CHANNEL);
  }
}
