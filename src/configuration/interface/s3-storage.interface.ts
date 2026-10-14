/**
 * S3存储配置
 */
export interface IS3StorageConfiguration {
  /**
   * S3端点
   */
  endpoint: string;

  /**
   * S3区域
   */
  region?: string;

  /**
   * S3身份验证AK
   */
  accessKeyId: string;

  /**
   * S3身份验证SK
   */
  secretAccessKey: string;
}
