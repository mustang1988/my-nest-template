import { Inject } from '@nestjs/common';
import { getMySQLRepoToken } from '../mysql.constant';

/**
 * @InjectRepo()装饰器注册表
 *
 * 记录所有通过@InjectRepo()装饰器声明的(连接名称, 实体类)组合,
 * MySQLModule.forRootAsync()在模块定义时读取注册表, 为其中连接名称在本模块`names`范围内的组合注册Repository Provider
 *
 * 注册表的完备性依赖ES Module的导入求值顺序: 使用@InjectRepo()的类所在文件必然先于MySQLModule.forRootAsync()的调用完成加载求值;
 * 注意: 通过LazyModuleLoader延迟加载的模块中使用的@InjectRepo()装饰器求值晚于forRootAsync(), 注册表将不包含其登记的组合
 */
const injectRepoRegistry: Map<string, Set<Function>> = new Map();

/**
 * 获取@InjectRepo()装饰器注册表(只读)
 *
 * @return 注册表, Key为连接名称, Value为该连接下被注入的实体类集合
 */
export const getInjectRepoRegistry = (): ReadonlyMap<string, Set<Function>> => injectRepoRegistry;

/**
 * 注入指定数据源下指定实体的Repository
 *
 * 实体需遵循MySQL模块的实体文件命名约定(`xxx.{连接名称}.entity.ts/js`), 以保证实体被对应数据源加载;
 * 实体是否被数据源实际加载以数据源初始化后的实体元数据为准
 *
 * @param dataSourceName MySQL连接名称
 * @param entity 实体类
 */
export const InjectRepo = (dataSourceName: string, entity: Function) => {
  /**
   * 登记(连接名称, 实体类)组合, 供MySQLModule.forRootAsync()注册对应Repository Provider
   */
  if (!injectRepoRegistry.has(dataSourceName)) {
    injectRepoRegistry.set(dataSourceName, new Set());
  }
  injectRepoRegistry.get(dataSourceName)!.add(entity);
  return Inject(getMySQLRepoToken(dataSourceName, entity));
};
