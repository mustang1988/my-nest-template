import { ModuleMetadata } from '@nestjs/common';
import { IRabbitmqClientOptions } from './rabbitmq-client-options.interface';

/**
 * Rabbitmq模块异步初始化选项
 */
export interface IRabbitmqModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  isGlobal?: boolean;
  inject?: any[];
  names?: Array<string>;
  useFactory: (...args: Array<any>) => Array<IRabbitmqClientOptions> | Promise<Array<IRabbitmqClientOptions>>;
}
