import { Logger } from 'winston';
import { DataSource, Repository } from 'typeorm';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DynamicModule, Module, Provider } from '@nestjs/common';
import { DataMaskingUtil } from '../common/util/data-masking.util';
import { getInjectRepoRegistry } from './decorator/inject-repo.decorator';
import { IMySQLModuleAsyncOptions } from './interface/mysq-module-options.interface';
import { IMySQLDataSourceOptions } from './interface/mysql-datasource-options.interface';
import { MySQLDataSourceNotFoundException } from './exception/mysql-datasource-not-found.exception';
import { getMySQLDataSourceToken, getMySQLRepoToken, MYSQL_DATASOURCE_MAP_TOKEN, MYSQL_DATASOURCE_OPTIONS_TOKEN } from './mysql.constant';

/**
 * MySQL模块
 *
 * - 动态模块
 * - 基于TypeORM
 */
@Module({})
export class MySQLModule {
  static forRootAsync(options: IMySQLModuleAsyncOptions): DynamicModule {
    const { isGlobal = true, imports = [ConfigModule], inject = [ConfigService], names = ['default'] } = options;

    const mysqlDataSourceOptionsProvider: Provider<Array<IMySQLDataSourceOptions>> = {
      provide: MYSQL_DATASOURCE_OPTIONS_TOKEN,
      inject,
      useFactory: options.useFactory,
    };

    const mysqlDataSourceMapProvider: Provider<Map<string, DataSource>> = {
      provide: MYSQL_DATASOURCE_MAP_TOKEN,
      inject: [MYSQL_DATASOURCE_OPTIONS_TOKEN, WINSTON_MODULE_PROVIDER],
      useFactory: async (mysqlDataSourceOptions: Array<IMySQLDataSourceOptions>, logger: Logger) => {
        logger = logger.child({ context: this.name });
        const mysqlDataSourceMap: Map<string, DataSource> = new Map();
        for (const mysqlOpt of mysqlDataSourceOptions) {
          if (!names.includes(mysqlOpt.name)) {
            continue;
          }
          const dataSource = new DataSource({
            type: 'mysql',
            host: mysqlOpt.host,
            port: mysqlOpt.port,
            username: mysqlOpt.username,
            password: mysqlOpt.password,
            database: mysqlOpt.database,
            charset: mysqlOpt.charset,
            timezone: mysqlOpt.timezone,
            logging: mysqlOpt.enableLogger,
            synchronize: mysqlOpt.enableSynchronize,
            logger: 'formatted-console',
            bigNumberStrings: false,
            entities: [__dirname + `/../**/*.${mysqlOpt.name}.entity{.ts,.js}`], // 加载其他模块下 xxx.{连接名称}.entity文件名的实体
            extra: {
              /**
               * mysql2连接池选项(自动重连)
               *
               * - MySQL基于连接池访问, 无客户端级"重连"概念; 连接异常断链时连接池自动剔除损坏连接, 后续查询自动创建新连接, 服务恢复后无需干预
               * - enableKeepAlive开启TCP keepAlive, 及时检测空闲连接断链, 避免拿到已断开的连接
               */
              connectionLimit: mysqlOpt.poolSize,
              enableKeepAlive: true,
              keepAliveInitialDelay: 10_000,
            },
          });
          mysqlDataSourceMap.set(mysqlOpt.name, dataSource);
          await dataSource.initialize();
          logger.info(
            'MySQL数据源初始化完成: name = %s, options = %j',
            mysqlOpt.name,
            DataMaskingUtil.maskingObject(mysqlOpt, { fields: ['username', 'password'] }),
          );
        }
        return mysqlDataSourceMap;
      },
    };

    const mysqlDataSources: Array<Provider<DataSource>> = names.map((name) => ({
      provide: getMySQLDataSourceToken(name),
      inject: [MYSQL_DATASOURCE_MAP_TOKEN, WINSTON_MODULE_PROVIDER],
      useFactory: (mysqlDataSourceMap: Map<string, DataSource>, logger: Logger) => {
        logger = logger.child({ context: this.name });
        const dataSource = mysqlDataSourceMap.get(name);
        if (!dataSource) {
          logger.error('未找到指定名称的MySQL数据源对象: name = %s', name);
          throw new MySQLDataSourceNotFoundException(name);
        }
        return dataSource;
      },
    }));

    /**
     * 各数据源下各实体的Repository Provider
     *
     * 从@InjectRepo()装饰器注册表中读取本模块连接名称范围内被注入的(连接名称, 实体类)组合,
     * 为每个组合注册对应的Repository Provider
     *
     * 实体类的发现以数据源自身为准: 数据源初始化时按实体文件命名约定(xxx.{连接名称}.entity.ts/js)加载实体,
     * 此处以数据源初始化后的实体元数据校验实体确已被加载
     *
     * @see [InjectRepo](./decorator/inject-repo.decorator.ts)
     */
    const mysqlRepos: Array<Provider<Repository<object>>> = Array.from(getInjectRepoRegistry().entries())
      .filter(([name]) => names.includes(name))
      .flatMap(([name, entities]) =>
        Array.from(entities).map((entity) => ({
          provide: getMySQLRepoToken(name, entity),
          inject: [MYSQL_DATASOURCE_MAP_TOKEN, WINSTON_MODULE_PROVIDER],
          useFactory: (mysqlDataSourceMap: Map<string, DataSource>, logger: Logger) => {
            logger = logger.child({ context: this.name });
            const dataSource = mysqlDataSourceMap.get(name);
            if (!dataSource) {
              logger.error('未找到指定名称的MySQL数据源对象: name = %s', name);
              throw new MySQLDataSourceNotFoundException(name);
            }
            if (!dataSource.hasMetadata(entity)) {
              logger.error('指定实体未被数据源加载(请检查实体文件命名约定xxx.{连接名称}.entity.ts/js): name = %s, entity = %s', name, entity.name);
              throw new Error(`实体未被数据源加载: name = ${name}, entity = ${entity.name}`);
            }
            return dataSource.getRepository(entity);
          },
        })),
      );

    return {
      global: isGlobal,
      module: MySQLModule,
      imports,
      providers: [mysqlDataSourceOptionsProvider, mysqlDataSourceMapProvider, ...mysqlDataSources, ...mysqlRepos],
      exports: [...mysqlDataSources, ...mysqlRepos],
    };
  }
}
