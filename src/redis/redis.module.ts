import {
  getRedisClientToken,
  REDIS_CLIENTS_TOKEN,
  getRedisSubscriberToken,
  REDIS_SUBSCRIBERS_TOKEN,
  REDIS_MODULE_ASYNC_OPTIONS_TOKEN,
} from './redis.constant';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createClient, RedisClientType } from '@redis/client';
import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { RedisEventEmitterService } from './service/redis-event-emitter.service';
import { RedisEventListenerService } from './service/redis-event-listener.service';
import { RedisModuleForRootAsyncOptions } from './interface/redis-module-options.interface';
import { IRedisConfiguration } from '../configuration/interface/redis-configuration.interface';

/**
 * Redis模块
 *
 * - 全局模块
 */
@Global()
@Module({
  // imports: [EventEmitterModule.forRoot({ global: true, inheritRequestContextId: true })],
  // providers: [RedisEventEmitterService, RedisEventListenerService, ...redisClients],
  // exports: [RedisEventEmitterService, ...redisClients],
})
export class RedisModule {
  static forRootAsync(options: RedisModuleForRootAsyncOptions): DynamicModule {
    const {
      isGlobal = true,
      inject = [ConfigService],
      imports = [ConfigModule, EventEmitterModule.forRoot({ global: true, inheritRequestContextId: true })],
      names = ['default'],
      useFactory,
    } = options;

    // #region 创建配置选项provider, 注入IoC但不export
    const optionProvider: Provider<Map<string, IRedisConfiguration>> = {
      provide: REDIS_MODULE_ASYNC_OPTIONS_TOKEN,
      useFactory,
      inject: inject ?? [ConfigService],
    };
    // #endregion

    // #region 创建Redis客户端, 注入IoC但不export
    const redisClientsProvider: Provider<Map<string, RedisClientType>> = {
      provide: REDIS_CLIENTS_TOKEN,
      inject: [REDIS_MODULE_ASYNC_OPTIONS_TOKEN],
      useFactory: async (redisConfigMap: Map<string, IRedisConfiguration>): Promise<Map<string, RedisClientType>> => {
        const redisClients = new Map<string, RedisClientType>();
        for (const [redisClientName, redisClientConf] of redisConfigMap.entries()) {
          const redisClient = createClient({
            socket: {
              host: redisClientConf.host,
              port: redisClientConf.port,
            },
            username: redisClientConf.username,
            password: redisClientConf.password,
            database: redisClientConf.db,
          });
          await redisClient.connect();
          redisClients.set(redisClientName, redisClient);
        }
        return redisClients;
      },
    };
    // #endregion

    // #region 创建Redis订阅客户端
    const redisSubscribersProvider: Provider<Map<string, RedisClientType>> = {
      provide: REDIS_SUBSCRIBERS_TOKEN,
      inject: [REDIS_MODULE_ASYNC_OPTIONS_TOKEN],
      useFactory: async (redisConfigMap: Map<string, IRedisConfiguration>): Promise<Map<string, RedisClientType>> => {
        const redisClients = new Map<string, RedisClientType>();
        for (const [redisClientName, redisClientConf] of redisConfigMap.entries()) {
          const redisClient = createClient({
            socket: {
              host: redisClientConf.host,
              port: redisClientConf.port,
            },
            username: redisClientConf.username,
            password: redisClientConf.password,
            database: redisClientConf.db,
          });
          await redisClient.connect();
          redisClients.set(redisClientName, redisClient);
        }
        return redisClients;
      },
    };
    // #endregion

    // #region 创建各redis客户端provider
    const redisClientProviders: Array<Provider<RedisClientType>> = names
      .map((name) => {
        return {
          provide: getRedisClientToken(name),
          inject: [REDIS_CLIENTS_TOKEN],
          useFactory: (redisClientsMap: Map<string, RedisClientType>) => {
            const client = redisClientsMap.get(name);
            if (!client) {
              throw new Error(`Redis client name not found: ${name}`);
            }
            return client;
          },
        };
      })
      .filter((p) => p);
    // #endregion

    // #region 创建各redis订阅端provider
    const redisSubscriberProviders: Array<Provider<RedisClientType>> = names
      .map((name) => {
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
      })
      .filter((p) => p);
    // #endregion

    return {
      global: isGlobal,
      imports: [...imports],
      module: RedisModule,
      providers: [
        RedisEventEmitterService,
        RedisEventListenerService,
        /**
         * 注入配置
         */
        optionProvider,

        /**
         * 注入客户端Map
         */
        redisClientsProvider,

        /**
         * 注入订阅端Map
         */
        redisSubscribersProvider,

        /**
         * 注入单个客户端
         */
        ...redisClientProviders,

        /**
         * 注入单个订阅端
         */
        ...redisSubscriberProviders,
      ],
      exports: [
        RedisEventEmitterService,
        RedisEventListenerService,
        optionProvider,
        redisClientsProvider,
        redisSubscribersProvider,
        ...redisClientProviders,
        ...redisSubscriberProviders,
      ],
    };
  }
}
