import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createClient, RedisClientType } from '@redis/client';
import { DynamicModule, Module, Provider } from '@nestjs/common';
import { DataMaskingUtil } from '../common/util/data-masking.util';
import { RedisEventEmitterService } from './service/redis-event-emitter.service';
import { IRedisClientOptions } from './interface/redis-client-options.interface';
import { RedisEventListenerService } from './service/redis-event-listener.service';
import { IRedisModuleAsyncOptions } from './interface/redis-module-options.interface';
import { RedisClientNotFoundException } from './exception/redis-client-not-found.exception';
import { getRedisClientToken, REDIS_CLIENTS_MAP_TOKEN, REDIS_CLIENT_OPTIONS_TOKEN, REDIS_SUBSCRIBERS_MAP_TOKEN } from './redis.constant';

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

    const redisClientOptionsProvider: Provider<Array<IRedisClientOptions>> = {
      provide: REDIS_CLIENT_OPTIONS_TOKEN,
      inject,
      useFactory,
    };

    const redisClientsMapProvider: Provider<Map<string, RedisClientType>> = {
      provide: REDIS_CLIENTS_MAP_TOKEN,
      inject: [REDIS_CLIENT_OPTIONS_TOKEN, WINSTON_MODULE_PROVIDER],
      useFactory: async (redisClientOptions: Array<IRedisClientOptions>, logger: Logger): Promise<Map<string, RedisClientType>> => {
        logger = logger.child({ context: this.name });
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
          logger.info(
            'Redis客户端初始化完成: name = %s, options = %j',
            redisClientOpt.name,
            DataMaskingUtil.maskingObject(redisClientOpt, { fields: ['password'] }),
          );
          redisClients.set(redisClientOpt.name, redisClient);
        }
        return redisClients;
      },
    };

    const redisSubscribersMapProvider: Provider<Map<string, RedisClientType>> = {
      provide: REDIS_SUBSCRIBERS_MAP_TOKEN,
      inject: [REDIS_CLIENT_OPTIONS_TOKEN, WINSTON_MODULE_PROVIDER],
      useFactory: async (redisClientOptions: Array<IRedisClientOptions>, logger: Logger): Promise<Map<string, RedisClientType>> => {
        logger = logger.child({ context: this.name });
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
          logger.info(
            'Redis订阅端初始化完成: name = %s, options = %j',
            redisClientOpt.name,
            DataMaskingUtil.maskingObject(redisClientOpt, { fields: ['password'] }),
          );
          redisClients.set(redisClientOpt.name, redisClient);
        }
        return redisClients;
      },
    };

    const redisClients: Array<Provider<RedisClientType>> = names.map((name) => {
      return {
        provide: getRedisClientToken(name),
        inject: [REDIS_CLIENTS_MAP_TOKEN, WINSTON_MODULE_PROVIDER],
        useFactory: (redisClientsMap: Map<string, RedisClientType>, logger: Logger) => {
          logger = logger.child({ context: this.name });
          const redisClient = redisClientsMap.get(name);
          if (!redisClient) {
            logger.error('未找到指定名称的Redis客户端对象: name = %s', name);
            throw new RedisClientNotFoundException(name);
          }
          return redisClient;
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
        redisClientOptionsProvider,
        redisClientsMapProvider,
        redisSubscribersMapProvider,
        ...redisClients,
      ],
      exports: [RedisEventEmitterService, ...redisClients],
    };
  }
}
