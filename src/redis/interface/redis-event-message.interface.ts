/**
 * Redis事件类型
 */
export type EventType = symbol | string;

/**
 * Redis事件消息
 */
export interface IRedisEventMessage<E extends EventType, P> {
  /**
   * 事件类型
   */
  event: E;

  /**
   * 事件唯一ID
   */
  eventId?: string;

  /**
   * 事件负载
   */
  payload: P;

  /**
   * 触发事件的请求ID
   */
  requestId?: string;

  /**
   * 目标实例编号
   */
  target?: number;
}
