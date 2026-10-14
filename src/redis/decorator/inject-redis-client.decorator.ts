import { Inject } from '@nestjs/common';
import { getRedisClientToken, getRedisSubscriberToken } from '../redis.constant';

/**
 * 注入指定名称的Redis连接客户端
 * @param name Redis连接名称
 */
export const InjectRedisClient = (name: string) => Inject(getRedisClientToken(name));

/**
 * 注入指定名称的Redis订阅客户端
 * @param name Redis连接名称
 */
export const InjectRedisSubscriber = (name: string) => Inject(getRedisSubscriberToken(name));
