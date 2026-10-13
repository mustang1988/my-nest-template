import { InjectionToken } from '@nestjs/common';

/**
 * Rabbitmq模块异步初始化选项IoC注入Token
 *
 * 注入的Provider泛型为: Array<IRabbitmqClientOptions>
 */
export const RABBITMQ_CLIENT_OPTIONS_TOKEN: symbol = Symbol('token:rabbitmq-client-options');

/**
 * Rabbitmq客户端Map IoC注入Token
 *
 * 注入的Provider泛型为: Map<string, ClientProxy>
 */
export const RABBITMQ_CLIENTS_MAP_TOKEN: symbol = Symbol('token:rabbitmq-clients-map');

/**
 * 获取指定名称Rabbitmq连接客户端IoC注入Token
 * @param name Rabbitmq连接名称
 * @return Rabbitmq连接客户端IoC注入Token
 */
export const getRabbitmqClientToken = (name: string): InjectionToken => {
  return `token:rabbitmq-client:${name}`;
};
