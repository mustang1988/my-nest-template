/**
 * Redis配置
 */
export interface IRedisConfiguration {
  /**
   * Redis主机
   */
  host: string;

  /**
   * Redis端口
   */
  port: number;

  /**
   * Redis密码
   */
  password?: string;

  /**
   * Redis用户名
   */
  username?: string;

  /**
   * Redis库索引
   */
  db: number;

  /**
   * Redis事件发布通道
   */
  eventChannel: string;
}
