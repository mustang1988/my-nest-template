/**
 * Redis配置
 */
export interface IRedisConfiguration {
  /**
   * Redis主机
   *
   * - 必填
   * - 字符串
   */
  host: string;

  /**
   * Redis端口
   *
   * - 可选
   * - 整数
   * - 默认值: 6379
   */
  port?: number;

  /**
   * Redis密码
   *
   * - 可选
   * - 字符串
   */
  password?: string;

  /**
   * Redis用户名
   *
   * - 可选
   * - 字符串
   */
  username?: string;

  /**
   * Redis库索引
   *
   * - 可选
   * - 整数
   * - 取值范围
   *   - [0, 16]
   * - 默认值: 0
   */
  db?: number;

  /**
   * Redis事件发布通道
   *
   * - 可选
   * - 字符串
   * - 默认值: 'channel:default'
   */
  eventChannel?: string;
}
