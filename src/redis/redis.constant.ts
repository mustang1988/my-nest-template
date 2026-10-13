import { InjectionToken } from '@nestjs/common';

/**
 * Redis模块异步初始化选项IoC注入Token
 *
 * 注入的Provider泛型为: Array<IRedisClientOptions>
 */
export const REDIS_CLIENT_OPTIONS_TOKEN: symbol = Symbol('token:redis-client-options');

/**
 * Redis连接客户端IoC注入Token
 *
 * 注入的Provider泛型为: Map<string, RedisClientType>
 */
export const REDIS_CLIENTS_MAP_TOKEN: symbol = Symbol('token:redis-clients-map');

/**
 * Redis订阅端IoC注入Token
 *
 * 注入的Provider泛型为: Map<string, RedisClientType>
 */
export const REDIS_SUBSCRIBERS_MAP_TOKEN: symbol = Symbol('token:redis-subscribers-map');

/**
 * 获取指定名称Redis连接客户端IoC注入Token
 * @param name Redis连接名称
 * @return Redis连接客户端IoC注入Token
 */
export const getRedisClientToken = (name: string): InjectionToken => {
  return `token:redis-client:${name}`;
};

/**
 * 获取指定名称Redis订阅客户端IoC注入Token
 * @param name Redis连接名称
 * @return Redis订阅客户端IoC注入Token
 */
export const getRedisSubscriberToken = (name: string): InjectionToken => {
  return `token:redis-subscruber:${name}`;
};
