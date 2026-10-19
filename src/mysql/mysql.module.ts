import { Logger } from 'winston';
import { DataSource } from 'typeorm';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DynamicModule, Module, Provider } from '@nestjs/common';
import { DataMaskingUtil } from '../common/util/data-masking.util';
import { IMySQLModuleAsyncOptions } from './interface/mysq-module-options.interface';
import { IMySQLDataSourceOptions } from './interface/mysql-datasource-options.interface';
import { MySQLDataSourceNotFoundException } from './exception/mysql-datasource-not-found.exception';
import { getMySQLDataSourceToken, MYSQL_DATASOURCE_MAP_TOKEN, MYSQL_DATASOURCE_OPTIONS_TOKEN } from './mysql.constant';

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

    return {
      global: isGlobal,
      module: MySQLModule,
      imports,
      providers: [mysqlDataSourceOptionsProvider, mysqlDataSourceMapProvider, ...mysqlDataSources],
      exports: [...mysqlDataSources],
    };
  }
}
