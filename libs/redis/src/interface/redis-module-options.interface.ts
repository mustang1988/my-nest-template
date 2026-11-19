import { ICommonModuleAsyncOptions } from '@pgu/common';
import { IRedisClientOptions } from './redis-client-options.interface';

/**
 * Redis模块异步初始化选项
 */
export interface IRedisModuleAsyncOptions extends ICommonModuleAsyncOptions<Array<IRedisClientOptions>> {
  /**
   * 需要初始化的Redis配置名称列表
   *
   * - 可选
   * - 默认值: ['default']
   */
  names?: Array<string>;
}
