export interface IRabbitmqConfiguration {
  /**
   * Rabbitmq主机
   */
  host: string;

  /**
   * Rabbitmq端口
   */
  port?: number;

  /**
   * Rabbitmq用户名
   */
  username: string;

  /**
   * Rabbitmq密码
   */
  password: string;

  /**
   * Rabbitmq vhost
   */
  vhost?: string;

  /**
   * Rabbitmq队列名称
   */
  queue: string;

  /**
   * Rabbitmq队列是否执行消费
   */
  consume: boolean;

  /**
   * Rabbitmq队列消费预取消息数量
   */
  prefetchCount: number;

  /**
   * Rabbitmq消息消费后是否自动ACK
   */
  noAck: boolean;
}
