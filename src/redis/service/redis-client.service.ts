import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DEFAULT_REDIS_CLIENT } from '../redis.constant';
import { createClient, RedisClientType } from '@redis/client';
import { IRedisConfiguration } from '../../configuration/interface/redis-configuration.interface';

export const redisClients: Array<Provider<RedisClientType>> = [
  /**
   * 默认Redis连接客户端
   */
  {
    provide: DEFAULT_REDIS_CLIENT,
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
