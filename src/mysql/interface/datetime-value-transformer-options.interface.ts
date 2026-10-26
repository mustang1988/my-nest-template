/**
 * datetime类型字段值转换器选项
 */
export interface IDateTimeValueTransformerOptions {
  /**
   * 日期格式
   * @see https://moment.github.io/luxon/#/formatting
   *
   * - 可选
   * - 字符串
   * - 默认值: 'yyyy-MM-dd HH:mm:ss.SSS'
   */
  format?: string;

  /**
   * 时区
   * @see https://moment.github.io/luxon/#/zones?id=luxon-works-with-time-zones
   *
   * - 可选
   * - 字符串
   * - 默认值: 'UTC+8'
   */
  zone?: string;
}
