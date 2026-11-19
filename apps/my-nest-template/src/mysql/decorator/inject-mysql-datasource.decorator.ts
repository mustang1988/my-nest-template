import { Inject } from '@nestjs/common';
import { getMySQLDataSourceToken } from '../mysql.constant';

/**
 * @InjectMySQLDataSource()装饰器注册表
 *
 * 记录所有通过@InjectMySQLDataSource()装饰器声明的数据源名称,
 * MySQLModule.forRootAsync()在模块定义时读取注册表, 仅为其中在本模块`names`范围内的名称建立连接与注册数据源Provider
 *
 * 注册表的完备性依赖ES Module的导入求值顺序: 使用@InjectMySQLDataSource()的类所在文件必然先于MySQLModule.forRootAsync()的调用完成加载求值
 */
const injectMySQLDataSourceRegistry: Set<string> = new Set();

/**
 * 获取@InjectMySQLDataSource()装饰器注册表(只读)
 *
 * @return 注册表, 内容为被注入的数据源名称
 */
export const getInjectMySQLDataSourceRegistry = (): ReadonlySet<string> => injectMySQLDataSourceRegistry;

/**
 * 注入指定名称的MySQL数据源
 * @param name MySQL连接名称
 */
export const InjectMySQLDataSource = (name: string) => {
  /**
   * 登记数据源名称, 供MySQLModule.forRootAsync()注册对应数据源Provider
   */
  injectMySQLDataSourceRegistry.add(name);
  return Inject(getMySQLDataSourceToken(name));
};
