/**
 * Rabbitmq配置
 */
export interface IRabbitmqConfiguration {
  /**
   * Rabbitmq主机
   *
   * - 必填
   * - 字符串
   */
  host: string;

  /**
   * Rabbitmq端口
   *
   * - 可选
   * - 整数
   * - 默认值: 5672
   */
  port?: number;

  /**
   * Rabbitmq用户名
   *
   * - 必填
   * - 字符串
   */
  username: string;

  /**
   * Rabbitmq密码
   *
   * - 必填
   * - 字符串
   */
  password: string;

  /**
   * Rabbitmq vhost
   *
   * - 可选
   * - 字符串
   * - 默认值: undefined
   */
  vhost?: string;

  /**
   * Rabbitmq队列名称
   *
   * - 必填
   * - 字符串
   */
  queue: string;

  /**
   * Rabbitmq队列是否执行消费
   *
   * 配置为true时, 服务启动时会启动该Rabbitmq的队列消费监听
   * @see [main.ts-Rabbitmq队列消费](../../main.ts)
   *
   * - 必填
   * - 布尔值
   */
  consume: boolean;

  /**
   * Rabbitmq队列消费预取消息数量
   *
   * - 可选
   * - 整数
   * - 默认值: 1
   */
  prefetchCount?: number;

  /**
   * Rabbitmq消息消费后是否自动ACK
   *
   * - 可选
   * - 布尔值
   * - 默认值: true
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
  noAck?: boolean;
}
