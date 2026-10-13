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

    // #region 创建配置选项provider, 注入IoC但不export
    const optionProvider: Provider<Array<IRedisClientOptions>> = {
      provide: REDIS_MODULE_ASYNC_OPTIONS_TOKEN,
      inject,
      useFactory,
    };
    // #endregion

    // #region 创建Redis客户端
    const redisClientsProvider: Provider<Map<string, RedisClientType>> = {
      provide: REDIS_CLIENTS_TOKEN,
      inject: [REDIS_MODULE_ASYNC_OPTIONS_TOKEN],
      useFactory: async (redisClientOptions: Array<IRedisClientOptions>): Promise<Map<string, RedisClientType>> => {
        const redisClients = new Map<string, RedisClientType>();
        for (const redisClientOpt of redisClientOptions) {
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
          redisClients.set(redisClientOpt.name, redisClient);
        }
        return redisClients;
      },
    };
    // #endregion

    // #region 创建Redis订阅客户端
    const redisSubscribersProvider: Provider<Map<string, RedisClientType>> = {
      provide: REDIS_SUBSCRIBERS_TOKEN,
      inject: [REDIS_MODULE_ASYNC_OPTIONS_TOKEN],
      useFactory: async (redisClientOptions: Array<IRedisClientOptions>): Promise<Map<string, RedisClientType>> => {
        const redisClients = new Map<string, RedisClientType>();
        for (const redisClientOpt of redisClientOptions) {
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
          redisClients.set(redisClientOpt.name, redisClient);
        }
        return redisClients;
      },
    };
    // #endregion

    // #region 创建各redis客户端provider
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
    // #endregion

    // #region 创建各redis订阅端provider
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
    // #endregion

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
