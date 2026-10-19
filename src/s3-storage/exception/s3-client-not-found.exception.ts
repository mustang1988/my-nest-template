/**
 * S3客户端未找到异常
 */
export class S3ClientNotFoundException extends Error {
  constructor(name: string, options?: ErrorOptions) {
    super(`未找到指定名称的S3客户端对象: ${name}`, options);
  }
}
