import { ModuleMetadata } from '@nestjs/common';
import { IMySQLDataSourceOptions } from './mysql-datasource-options.interface';

export interface IMySQLModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  isGlobal?: boolean;
  inject?: Array<any>;
  names?: Array<string>;
  useFactory: (...args: Array<any>) => Array<IMySQLDataSourceOptions> | Promise<Array<IMySQLDataSourceOptions>>;
}
