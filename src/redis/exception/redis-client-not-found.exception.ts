/**
 * Redis连接客户端未找到异常
 */
export class RedisClientNotFoundException extends Error {
  constructor(name: string, options?: ErrorOptions) {
    super(`未找到指定名称的Redis客户端对象: ${name}`, options);
  }
}
