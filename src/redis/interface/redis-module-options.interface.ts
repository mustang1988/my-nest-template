import { DynamicModule } from '@nestjs/common';
import { IRedisConfiguration } from '../../configuration/interface/redis-configuration.interface';

/**
 * Redis模块异步初始化选项
 */
export interface RedisModuleForRootAsyncOptions extends Pick<DynamicModule, 'imports'> {
  isGlobal?: boolean;
  inject?: any[];
  useFactory: (...args: any[]) => Map<string, IRedisConfiguration> | Promise<Map<string, IRedisConfiguration>>;
  names?: Array<string>;
}
