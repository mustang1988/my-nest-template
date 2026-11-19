/**
 * Redis事件发布选项
 */
export interface IRedisEventEmitOptions {
  /**
   * 目标处理实例ID
   */
  instanceId?: number;

  /**
   * 使用的Redis连接名称
   */
  clientName?: string;
}
