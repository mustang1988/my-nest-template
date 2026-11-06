import { Inject } from '@nestjs/common';
import { getRabbitmqClientToken } from '../rabbitmq.constant';

/**
 * @InjectRabbitmqClient()装饰器注册表
 *
 * 记录所有通过@InjectRabbitmqClient()装饰器声明的连接名称,
 * RabbitmqModule.forRootAsync()在模块定义时读取注册表, 仅为其中在本模块`names`范围内的名称建立连接与注册发送端Provider
 *
 * 注册表的完备性依赖ES Module的导入求值顺序: 使用@InjectRabbitmqClient()的类所在文件必然先于RabbitmqModule.forRootAsync()的调用完成加载求值
 */
const injectRabbitmqClientRegistry: Set<string> = new Set();

/**
 * 获取@InjectRabbitmqClient()装饰器注册表(只读)
 *
 * @return 注册表, 内容为被注入的连接名称
 */
export const getInjectRabbitmqClientRegistry = (): ReadonlySet<string> => injectRabbitmqClientRegistry;

/**
 * 注入指定名称的Rabbitmq消息发送客户端
 * @param name Rabbitmq连接名称
 */
export const InjectRabbitmqClient = (name: string) => {
  /**
   * 登记连接名称, 供RabbitmqModule.forRootAsync()注册对应发送端Provider
   */
  injectRabbitmqClientRegistry.add(name);
  return Inject(getRabbitmqClientToken(name));
};
