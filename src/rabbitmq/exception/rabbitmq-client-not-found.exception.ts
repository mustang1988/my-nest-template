/**
 * Rabbitmq客户端未找到异常
 */
export class RabbitmqClientNotFoundException extends Error {
  constructor(name: string, options?: ErrorOptions) {
    super(`未找到指定名称的Rabbitmq客户端对象: ${name}`, options);
  }
}
