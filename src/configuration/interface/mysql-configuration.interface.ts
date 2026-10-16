/**
 * MySQL配置
 */
export interface IMySQLConfiguration {
  /**
   * MySQL主机
   *
   * - 必填
   * - 字符串
   */
  host: string;

  /**
   * MySQL端口
   *
   * - 可选
   * - 整数
   * - 默认值: 3306
   */
  port?: number;

  /**
   * MySQL用户名
   *
   * - 必填
   * - 字符串
   */
  username: string;

  /**
   * MySQL密码
   *
   * - 必填
   * - 字符串
   */
  password: string;

  /**
   * MySQL数据库名
   *
   * - 必填
   * - 字符串
   */
  database: string;

  /**
   * MySQL连接字符集
   *
   * - 可选
   * - 字符串
   * - 默认值: 'utf8mb4'
   */
  charset?: string;

  /**
   * MySQL时区
   *
   * - 可选
   * - 字符串
   * - 默认值: +08:00
   */
  timezone?: string;

  /**
   * TypeORM SQL 控制台日志开关
   *
   * - 可选
   * - 布尔值
   * - 默认值: false
   */
  enableLogger?: boolean;

  /**
   * TypeORM 表结构同步开关
   *
   * - 可选
   * - 布尔值
   * - 默认值: false
   */
  enableSynchronize?: boolean;
}
