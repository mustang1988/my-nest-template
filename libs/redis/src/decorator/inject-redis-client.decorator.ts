import { Inject } from '@nestjs/common';
import { getRedisClientToken } from '../redis.constant';

/**
 * @InjectRedisClient()装饰器注册表
 *
 * 记录所有通过@InjectRedisClient()装饰器声明的连接名称,
 * RedisModule.forRootAsync()在模块定义时读取注册表, 仅为其中在本模块`names`范围内的名称注册连接客户端Provider
 *
 * 注册表的完备性依赖ES Module的导入求值顺序: 使用@InjectRedisClient()的类所在文件必然先于RedisModule.forRootAsync()的调用完成加载求值
 */
const injectRedisClientRegistry: Set<string> = new Set();

/**
 * 获取@InjectRedisClient()装饰器注册表(只读)
 *
 * @return 注册表, 内容为被注入的连接名称
 */
export const getInjectRedisClientRegistry = (): ReadonlySet<string> => injectRedisClientRegistry;

/**
 * 注入指定名称的Redis连接客户端
 * @param name Redis连接名称
 */
export const InjectRedisClient = (name: string) => {
  /**
   * 登记连接名称, 供RedisModule.forRootAsync()注册对应连接客户端Provider
   */
  injectRedisClientRegistry.add(name);
  return Inject(getRedisClientToken(name));
};
