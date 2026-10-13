import { IRedisConfiguration } from '../../configuration/interface/redis-configuration.interface';

/**
 * Redis客户端/订阅端配置选项
 */
export interface IRedisClientOptions extends IRedisConfiguration {
  /**
   * 名称
   */
  name: string;
}
