/**
 * S3存储配置
 */
export interface IS3StorageConfiguration {
  /**
   * S3端点
   *
   * - 必填
   * - 字符串
   */
  endpoint: string;

  /**
   * S3区域
   *
   * - 可选
   * - 字符串
   * - 默认值: 'default'
   */
  region?: string;

  /**
   * S3身份验证AK
   *
   * - 必填
   * - 字符串
   */
  accessKeyId: string;

  /**
   * S3身份验证SK
   *
   * - 必填
   * - 字符串
   */
  secretAccessKey: string;
}
