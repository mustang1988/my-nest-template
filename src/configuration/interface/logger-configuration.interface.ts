/**
 * 日志配置
 */
export interface ILoggerConfiguration {
  /**
   * 日志级别
   *
   * - 可选
   * - 字符串枚举 [Logging Levels](https://github.com/winstonjs/winston#logging-levels)
   * - 默认值: 'debug'
   */
  level?: string;

  /**
   * 单日志文件大小阈值
   *
   * 当单日志文件大小达到此阈值后会被切分
   *
   * - 可选
   * - 字符串
   * - 默认值: '2g'
   */
  maxSize?: string;

  /**
   * 日志文件最大保留数量
   *
   * - 可选
   * - 整数字符串或整数字符串+'d'
   *   - 整数字符串: 日志文件保留数量
   *   - 整数字符串+'d': 日志文件保留天数
   * - 默认值: 30d
   */
  maxFile?: string;

  /**
   * 控制台日志开关
   *
   * - 可选
   * - 布尔值
   * - 默认值: false
   */
  enableConsole?: boolean;

  /**
   * 日志文件输出目录
   *
   * - 可选
   * - 字符串
   * - 默认值: '/tmp'
   * - 注意: 容器化部署环境下为容器内路基, 需要设置volume映射
   */
  dirname?: string;

  /**
   * 是否输入json日志
   *
   * - 可选
   * - 布尔值
   * - 默认值: false
   * - json日志可用于日志收集, 如: ELK
   */
  jsonLogger?: boolean;

  /**
   * 是否对日志文件进行压缩
   *
   * - 可选
   * - 布尔值
   * - 默认值: true
   */
  zippedArchive?: boolean;
}
