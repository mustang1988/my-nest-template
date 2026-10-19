/**
 * MySQL数据源未找到异常
 */
export class MySQLDataSourceNotFoundException extends Error {
  constructor(name: string, options?: ErrorOptions) {
    super(`未找到指定名称的MySQL数据源对象: ${name}`, options);
  }
}
