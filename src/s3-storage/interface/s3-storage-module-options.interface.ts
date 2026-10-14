import { ModuleMetadata } from '@nestjs/common';
import { IS3ClientOptions } from './s3-client-options.interface';

/**
 * S3存储模块异步初始化选项
 */
export interface IS3StorageModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  isGlobal?: boolean;
  inject?: Array<any>;
  names: Array<string>;
  useFactory: (...args: Array<any>) => Array<IS3ClientOptions> | Promise<Array<IS3ClientOptions>>;
}
