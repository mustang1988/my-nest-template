import { DynamicModule } from '@nestjs/common';
import { IRedisClientOptions } from './redis-client-options.interface';

/**
 * Redis模块异步初始化选项
 */
export interface IRedisModuleAsyncOptions extends Pick<DynamicModule, 'imports'> {
  isGlobal?: boolean;
  inject?: any[];
  useFactory: (...args: any[]) => Array<IRedisClientOptions> | Promise<Array<IRedisClientOptions>>;
  names?: Array<string>;
}
