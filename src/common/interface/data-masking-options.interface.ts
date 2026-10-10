/**
 * 数据脱敏选项
 */
export interface IDataMaskingOptions {
  /**
   * 内容脱敏百分比
   *
   * - 整数
   * - 取值范围: [0, 100]
   * - 单位: %
   */
  percent?: number;

  /**
   * 需要脱敏的字段名称列表
   *
   * - 仅针对对象类型数据脱敏时使用
   */
  fields?: Array<string>;

  /**
   * 占位符
   *
   * - 数据脱敏后的占位字符串
   * - 默认值: '*'
   */
  placeholder?: string;
}
