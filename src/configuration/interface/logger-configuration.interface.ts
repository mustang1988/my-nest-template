/**
 * 日志配置
 */
export interface ILoggerConfiguration {
  /**
   * 日志级别
   */
  level?: string;

  /**
   * 单日志文件大小阈值
   *
   * 当单日志文件大小达到此阈值后会被切分
   */
  maxSize?: string;

  /**
   * 日志文件最大保留数量
   */
  maxFile?: number;

  /**
   * 控制台日志开关
   */
  enableConsole?: boolean;

  /**
   * 日志文件输出目录
   *
   * 注意: 容器化部署环境下为容器内路基, 需要设置volume映射
   */
  dirname?: string;
}
