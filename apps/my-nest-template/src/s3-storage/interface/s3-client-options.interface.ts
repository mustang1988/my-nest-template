import { IS3StorageConfiguration } from '../../configuration/interface/s3-storage.interface';

/**
 * S3客户端选项
 */
export interface IS3ClientOptions extends IS3StorageConfiguration {
  /**
   * 名称
   */
  name: string;
}
