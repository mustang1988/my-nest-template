/**
 * 应用配置
 */
export interface IAppConfiguration {
  /**
   * 应用标题
   *
   * 作用与以下部分
   * - 文件日志的文件名
   * - 日志中的标题
   */
  title: string;

  /**
   * 应用监听端口
   *
   * 注意: 容器化部署环境下为容器内监听端口, 需要设置port映射
   */
  port: number;
}
