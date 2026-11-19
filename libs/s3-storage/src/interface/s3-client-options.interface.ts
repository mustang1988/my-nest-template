import { IS3StorageConfiguration } from '@pgu/configuration';

/**
 * S3客户端选项
 */
export interface IS3ClientOptions extends IS3StorageConfiguration {
  /**
   * 名称
   */
  name: string;
}
