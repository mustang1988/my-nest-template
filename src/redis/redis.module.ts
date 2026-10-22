import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
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
  /**
   * 创建Redis连接客户端
   *
   * @param options 连接配置选项
   * @param logger 日志实例
   * @param purpose 用途说明(输出日志用), 如: 客户端/订阅端
   */
  private static createRedisClient(options: IRedisClientOptions, logger: Logger, purpose: string): RedisClientType {
    const redisClient = createClient({
      socket: {
        host: options.host,
        port: options.port,
        /**
         * 断链自动重连策略
         *
         * 返回值为下次重连的等待毫秒数; 此处配置为重试次数 * 100ms, 上限3000ms, 无限重试
         */
        reconnectStrategy: (retries: number) => Math.min(retries * 100, 3000),
      },
      username: options.username,
      password: options.password,
      database: options.db,
    });
    /**
     * 连接异常与断链重连事件日志
     */
    redisClient.on('error', (error) => logger.error('Redis%s连接异常: name = %s, error = %o', purpose, options.name, error));
    redisClient.on('reconnecting', () => logger.warn('Redis%s断链, 自动重连中: name = %s', purpose, options.name));
    return redisClient;
  }

  static forRootAsync(options: IRedisModuleAsyncOptions): DynamicModule {
    const { isGlobal = true, inject = [ConfigService], imports = [ConfigModule], names = ['default'], useFactory } = options;

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
          const redisClient = RedisModule.createRedisClient(redisClientOpt, logger, '客户端');
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
          const redisClient = RedisModule.createRedisClient(redisClientOpt, logger, '订阅端');
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
