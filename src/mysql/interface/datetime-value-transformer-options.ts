/**
 * datetime类型字段值转换器构造选项
 */
export interface IDateTimeValueTransformerOptions {
  /**
   * 日期格式
   * @see https://moment.github.io/luxon/#/formatting
   */
  format: string;

  /**
   * 时区
   * @see https://moment.github.io/luxon/#/zones?id=luxon-works-with-time-zones
   */
  zone: string;
}
