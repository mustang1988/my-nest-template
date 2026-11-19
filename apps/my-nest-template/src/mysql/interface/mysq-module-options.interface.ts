import { IMySQLDataSourceOptions } from './mysql-datasource-options.interface';
import { ICommonModuleAsyncOptions } from '../../common/interface/common-module-options.interface';

/**
 * MySQL模块异步初始化选项
 */
export interface IMySQLModuleAsyncOptions extends ICommonModuleAsyncOptions<Array<IMySQLDataSourceOptions>> {
  /**
   * 需要初始化的MySQL配置名称列表
   *
   * - 可选
   * - 默认值: ['default']
   */
  names?: Array<string>;
}
