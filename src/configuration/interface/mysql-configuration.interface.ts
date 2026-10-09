/**
 * MySQL配置
 */
export interface IMySQLConfiguration {
  /**
   * MySQL主机
   */
  host: string;

  /**
   * MySQL端口
   */
  port: number;

  /**
   * MySQL用户名
   */
  username: string;

  /**
   * MySQL密码
   */
  password: string;

  /**
   * MySQL数据库名
   */
  database: string;

  /**
   * MySQL连接字符集
   */
  charset?: string;

  /**
   * MySQL时区
   */
  timezone?: string;

  /**
   * TypeORM SQL 控制台日志开关
   */
  enableLogger?: boolean;

  /**
   * TypeORM 表结构同步开关
   */
  sync?: boolean;
}
