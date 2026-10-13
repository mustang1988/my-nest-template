import { InjectionToken } from '@nestjs/common';

/**
 * Redis模块异步初始化选项IoC注入Token
 *
 * 注入的Provider泛型为: Array<IRedisClientOptions>
 */
export const REDIS_MODULE_ASYNC_OPTIONS_TOKEN: symbol = Symbol('token:redis-module-async-options');

/**
 * Redis连接客户端IoC注入Token
 *
 * 注入的Provider泛型为: Map<string, RedisClientType>
 */
export const REDIS_CLIENTS_TOKEN: symbol = Symbol('token:redis-clients');

/**
 * Redis订阅端IoC注入Token
 *
 * 注入的Provider泛型为: Map<string, RedisClientType>
 */
export const REDIS_SUBSCRIBERS_TOKEN: symbol = Symbol('token:redis-subscribers');

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
