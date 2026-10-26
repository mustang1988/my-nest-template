import { IS3ClientOptions } from './s3-client-options.interface';
import { ICommonModuleAsyncOptions } from '../../common/interface/common-module-options.interface';

/**
 * S3存储模块异步初始化选项
 */
export interface IS3StorageModuleAsyncOptions extends ICommonModuleAsyncOptions<Array<IS3ClientOptions>> {
  /**
   * 需要初始化的S3配置名称列表
   *
   * - 可选
   * - 默认值: ['default']
   */
  names?: Array<string>;
}
