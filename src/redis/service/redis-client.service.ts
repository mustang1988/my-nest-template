import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, RedisClientType } from '@redis/client';
import { getRedisClientToken, getRedisSubscriberToken } from '../redis.constant';
import { IRedisConfiguration } from '../../configuration/interface/redis-configuration.interface';

export const redisClients: Array<Provider<RedisClientType>> = [
  /**
   * 默认Redis连接客户端
   */
  {
    provide: getRedisClientToken('default'),
    inject: [ConfigService],
    useFactory: async (configService: ConfigService): Promise<RedisClientType> => {
      const defaultRedisConf = configService.getOrThrow<Required<IRedisConfiguration>>('redis.default');
      const defaultRedisClient = createClient({
        socket: {
          host: defaultRedisConf.host,
          port: defaultRedisConf.port,
        },
        username: defaultRedisConf.username,
        password: defaultRedisConf.password,
        database: defaultRedisConf.db,
      });
      return await defaultRedisClient.connect();
    },
  },

  /**
   * 默认Redis订阅客户端
   */
  {
    provide: getRedisSubscriberToken('default'),
    inject: [ConfigService],
    useFactory: async (configService: ConfigService): Promise<RedisClientType> => {
      const defaultRedisConf = configService.getOrThrow<Required<IRedisConfiguration>>('redis.default');
      const defaultRedisClient = createClient({
        socket: {
          host: defaultRedisConf.host,
          port: defaultRedisConf.port,
        },
        username: defaultRedisConf.username,
        password: defaultRedisConf.password,
        database: defaultRedisConf.db,
      });
      return await defaultRedisClient.connect();
    },
  },
];
