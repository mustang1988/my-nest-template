/**
 * Rabbitmq配置
 */
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
   *
   * 配置为true时, 服务启动时会启动该Rabbitmq的队列消费监听
   * @see [main.ts-Rabbitmq队列消费](../../main.ts)
   */
  consume: boolean;

  /**
   * Rabbitmq队列消费预取消息数量
   */
  prefetchCount: number;

  /**
   * Rabbitmq消息消费后是否自动ACK
   *
   * 配置为true时, 队列消息消费者在完成消息消费后无需手动ack消息; 反之必须对消息ack
   *
   * @example
   * ```typescript
   * @MessagePattern(消息pattern)
   * async consumeSampleMessage(@Payload() payload: unknown, @Ctx() rmqContext: RmqContext) {
   *   try {
   *     // 消息消费逻辑
   *   } catch (error) {
   *     // 消息消费异常
   *     this.logger.error('error: %o', error);
   *   } finally {
   *     // 手动ack消息
   *     const channel = rmqContext.getChannelRef() as Channel;
   *     const originalMsg = rmqContext.getMessage() as Message;
   *     channel.ack(originalMsg);
   *   }
   * }
   * ```
   */
  noAck: boolean;
}
