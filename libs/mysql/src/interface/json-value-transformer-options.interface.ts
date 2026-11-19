/**
 * json字段值转换器选项
 */
export interface IJsonValueTransFormerOptions {
  /**
   * 转换失败时是否抛出异常
   *
   * - 可选
   * - 布尔值
   * - 默认值: true
   */
  fallbackError?: boolean;

  /**
   * 转换失败时回退返回值
   *
   * 仅在`fallbackError`设置为false时生效
   *
   * - 可选
   * - 任意值
   * - 默认: null
   */
  fallbackValue?: unknown;
}
