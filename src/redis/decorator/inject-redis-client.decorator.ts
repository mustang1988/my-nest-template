import { Inject } from '@nestjs/common';
import { getRedisClientToken } from '../redis.constant';

/**
 * 注入指定名称的Redis连接客户端
 * @param name Redis连接名称
 */
export const InjectRedisClient = (name: string) => Inject(getRedisClientToken(name));
