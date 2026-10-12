import { InjectionToken } from '@nestjs/common';

/**
 * 获取指定名称Rabbitmq连接客户端IoC注入Token
 * @param name Rabbitmq连接名称
 * @return Rabbitmq连接客户端IoC注入Token
 */
export const getRabbitmqClientToken = (name: string): InjectionToken => {
  return `token:rabbitmq-client:${name}`;
};
