import { ModuleMetadata } from '@nestjs/common';
import { IMySQLDataSourceOptions } from './mysql-datasource-options.interface';

/**
 * MySQL模块异步初始化选项
 */
export interface IMySQLModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  isGlobal?: boolean;
  inject?: Array<any>;
  names?: Array<string>;
  useFactory: (...args: Array<any>) => Array<IMySQLDataSourceOptions> | Promise<Array<IMySQLDataSourceOptions>>;
}
