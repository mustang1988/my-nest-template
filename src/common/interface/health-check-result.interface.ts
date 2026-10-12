/**
 * 健康检查结果
 */
export interface IHealthCheckResult {
  /**
   * Redis连接客户端健康检查结果
   */
  redis?: Record<string, 'healthy' | 'unhealthy'>;

  /**
   * MySQL数据源健康检查结果
   */
  mysql?: Record<string, 'healthy' | 'unhealthy'>;

  /**
   * Rabbitmq连接客户端健康检查结果
   */
  rabbitmq?: Record<string, 'healthy' | 'unhealthy'>;
}
