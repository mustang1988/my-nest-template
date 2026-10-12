import { InjectionToken } from '@nestjs/common';

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
