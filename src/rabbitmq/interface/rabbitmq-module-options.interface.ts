import { IRabbitmqClientOptions } from './rabbitmq-client-options.interface';
import { ICommonModuleAsyncOptions } from '../../common/interface/common-module-options.interface';

/**
 * Rabbitmq模块异步初始化选项
 */
export interface IRabbitmqModuleAsyncOptions extends ICommonModuleAsyncOptions<Array<IRabbitmqClientOptions>> {
  /**
   * 需要初始化的Rabbitmq配置名称列表
   *
   * - 可选
   * - 默认值: ['default']
   */
  names?: Array<string>;
}
