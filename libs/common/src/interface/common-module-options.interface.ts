import { ModuleMetadata } from '@nestjs/common';

/**
 * 通用动态模块初始化选项
 */
export interface ICommonModuleAsyncOptions<T> extends Pick<ModuleMetadata, 'imports'> {
  /**
   * 模块是否设置为全局
   *
   * - 可选
   * - 默认值: true
   */
  isGlobal?: boolean;

  /**
   * 注入服务
   *
   * - 可选
   * - 默认值: [ConfigService]
   */
  inject?: Array<any>;

  /**
   * 配置注入工厂函数
   * @param args 注入参数
   */
  useFactory: (...args: Array<any>) => T | Promise<T>;
}
