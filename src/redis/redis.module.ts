import {
  getRedisClientToken,
  REDIS_CLIENTS_TOKEN,
  getRedisSubscriberToken,
  REDIS_SUBSCRIBERS_TOKEN,
  REDIS_MODULE_ASYNC_OPTIONS_TOKEN,
} from './redis.constant';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createClient, RedisClientType } from '@redis/client';
import { DynamicModule, Module, Provider } from '@nestjs/common';
import { RedisEventEmitterService } from './service/redis-event-emitter.service';
import { IRedisClientOptions } from './interface/redis-client-options.interface';
import { RedisEventListenerService } from './service/redis-event-listener.service';
import { IRedisModuleAsyncOptions } from './interface/redis-module-options.interface';

/**
 * Redis模块
 *
 * - 动态模块
 */
@Module({})
export class RedisModule {
  static forRootAsync(options: IRedisModuleAsyncOptions): DynamicModule {
    const {
      isGlobal = true,
      inject = [ConfigService],
      imports = [ConfigModule, EventEmitterModule.forRoot({ global: true, inheritRequestContextId: true })],
      names = ['default'],
      useFactory,
    } = options;

    const optionProvider: Provider<Array<IRedisClientOptions>> = {
      provide: REDIS_MODULE_ASYNC_OPTIONS_TOKEN,
      inject,
      useFactory,
    };

    const redisClientsProvider: Provider<Map<string, RedisClientType>> = {
      provide: REDIS_CLIENTS_TOKEN,
      inject: [REDIS_MODULE_ASYNC_OPTIONS_TOKEN, WINSTON_MODULE_PROVIDER],
      useFactory: async (redisClientOptions: Array<IRedisClientOptions>, logger: Logger): Promise<Map<string, RedisClientType>> => {
        const redisClients = new Map<string, RedisClientType>();
        for (const redisClientOpt of redisClientOptions) {
          if (!names.includes(redisClientOpt.name)) {
            continue; // name中没有的配置不初始化连接客户端
          }
          const redisClient = createClient({
            socket: {
              host: redisClientOpt.host,
              port: redisClientOpt.port,
            },
            username: redisClientOpt.username,
            password: redisClientOpt.password,
            database: redisClientOpt.db,
          });
          await redisClient.connect();
          logger.info('Redis客户端初始化完成: name = %s', redisClientOpt.name);
          redisClients.set(redisClientOpt.name, redisClient);
        }
        return redisClients;
      },
    };

    const redisSubscribersProvider: Provider<Map<string, RedisClientType>> = {
      provide: REDIS_SUBSCRIBERS_TOKEN,
      inject: [REDIS_MODULE_ASYNC_OPTIONS_TOKEN, WINSTON_MODULE_PROVIDER],
      useFactory: async (redisClientOptions: Array<IRedisClientOptions>, logger: Logger): Promise<Map<string, RedisClientType>> => {
        const redisClients = new Map<string, RedisClientType>();
        for (const redisClientOpt of redisClientOptions) {
          if (!names.includes(redisClientOpt.name)) {
            continue; // name中没有的配置不初始化连接客户端
          }
          const redisClient = createClient({
            socket: {
              host: redisClientOpt.host,
              port: redisClientOpt.port,
            },
            username: redisClientOpt.username,
            password: redisClientOpt.password,
            database: redisClientOpt.db,
          });
          await redisClient.connect();
          logger.info('Redis订阅端初始化完成: name = %s', redisClientOpt.name);
          redisClients.set(redisClientOpt.name, redisClient);
        }
        return redisClients;
      },
    };

    const redisClientProviders: Array<Provider<RedisClientType>> = names.map((name) => {
      return {
        provide: getRedisClientToken(name),
        inject: [REDIS_CLIENTS_TOKEN],
        useFactory: (redisClientsMap: Map<string, RedisClientType>) => {
          const client = redisClientsMap.get(name);
          if (!client) {
            throw new Error(`Redis client not found: ${name}`);
          }
          return client;
        },
      };
    });

    const redisSubscriberProviders: Array<Provider<RedisClientType>> = names.map((name) => {
      return {
        provide: getRedisSubscriberToken(name),
        inject: [REDIS_CLIENTS_TOKEN],
        useFactory: (redisClientsMap: Map<string, RedisClientType>) => {
          const subscriber = redisClientsMap.get(name);
          if (!subscriber) {
            throw new Error(`Redis subscriber not found: ${name}`);
          }
          return subscriber;
        },
      };
    });

    return {
      global: isGlobal,
      imports: [...imports],
      module: RedisModule,
      providers: [
        RedisEventEmitterService,
        RedisEventListenerService,
        optionProvider,
        redisClientsProvider,
        redisSubscribersProvider,
        ...redisClientProviders,
        ...redisSubscriberProviders,
      ],
      exports: [RedisEventEmitterService, ...redisClientProviders, ...redisSubscriberProviders],
    };
  }
}
