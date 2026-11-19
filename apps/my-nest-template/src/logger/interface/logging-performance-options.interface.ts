/**
 * 函数性能日志装饰器选项
 */
export interface LoggingPerformanceOptions {
  /**
   * 性能阈值
   *
   * 函数执行耗时超过此阈值时输出WARN级别日志
   *
   * - 单位: 毫秒
   * - 默认值: 50
   */
  threshold?: number;

  /**
   * 是否禁用性能检测
   *
   * - 默认值: false
   */
  disable?: boolean;
}
