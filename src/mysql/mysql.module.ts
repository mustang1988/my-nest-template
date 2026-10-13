import { DataSource } from 'typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DynamicModule, Module, Provider } from '@nestjs/common';
import { IMySQLModuleAsyncOptions } from './interface/mysq-module-options.interface';
import { IMySQLDataSourceOptions } from './interface/mysql-datasource-options.interface';
import { getMySQLDataSourceToken, MYSQL_DATASOURCE_MAP, MYSQL_DATASOURCE_OPTIONS } from './mysql.constant';

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

    const mysqlDataSourceOptions: Provider<Array<IMySQLDataSourceOptions>> = {
      provide: MYSQL_DATASOURCE_OPTIONS,
      inject,
      useFactory: options.useFactory,
    };

    const mysqlDataSourceMap: Provider<Map<string, DataSource>> = {
      provide: MYSQL_DATASOURCE_MAP,
      inject: [MYSQL_DATASOURCE_OPTIONS],
      useFactory: async (mysqlDataSourceOptions: Array<IMySQLDataSourceOptions>) => {
        const mysqlDataSourceMap: Map<string, DataSource> = new Map();
        try {
          for (const opt of mysqlDataSourceOptions) {
            const dataSource = new DataSource({
              type: 'mysql',
              host: opt.host,
              port: opt.port,
              username: opt.username,
              password: opt.password,
              database: opt.database,
              charset: opt.charset,
              timezone: opt.timezone,
              logging: opt.enableLogger,
              synchronize: opt.sync,
              logger: 'formatted-console',
              bigNumberStrings: false,
              entities: [__dirname + `/../**/*.${opt.name}.entity{.ts,.js}`], // 加载其他模块下 xxx.{名称}.entity文件名的实体
            });
            mysqlDataSourceMap.set(opt.name, dataSource);
            await dataSource.initialize();
          }
        } catch (error) {
          console.error(error);
        }
        return mysqlDataSourceMap;
      },
    };

    const mysqlDataSources: Array<Provider<DataSource>> = names.map((name) => ({
      provide: getMySQLDataSourceToken(name),
      inject: [MYSQL_DATASOURCE_MAP],
      useFactory: (mysqlDataSourceMap: Map<string, DataSource>) => {
        const dataSource = mysqlDataSourceMap.get(name);
        if (!dataSource) {
          throw new Error(`MySQL DataSource not found: ${name}`);
        }
        return dataSource;
      },
    }));

    return {
      global: isGlobal,
      module: MySQLModule,
      imports,
      providers: [mysqlDataSourceOptions, mysqlDataSourceMap, ...mysqlDataSources],
      exports: [...mysqlDataSources],
    };
  }
}
