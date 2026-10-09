import { DataSource } from 'typeorm';
import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DEFAULT_MYSQL_DATASOURCE } from '../mysql.constant';
import { IMySQLConfiguration } from '../../configuration/interface/mysql-configuration.interface';

export const mysqlDataSources: Array<Provider> = [
  /**
   * 默认MySQL数据源
   */
  {
    provide: DEFAULT_MYSQL_DATASOURCE,
    inject: [ConfigService],
    useFactory: async (configService: ConfigService): Promise<DataSource> => {
      const defaultMySQLConfig = configService.getOrThrow<IMySQLConfiguration>('mysql.default');
      const defaultMySQLDataSource = new DataSource({
        type: 'mysql',
        host: defaultMySQLConfig.host,
        port: defaultMySQLConfig.port,
        username: defaultMySQLConfig.username,
        password: defaultMySQLConfig.password,
        charset: defaultMySQLConfig.charset,
        timezone: defaultMySQLConfig.timezone,
        logging: defaultMySQLConfig.enableLogger,
        logger: 'formatted-console',
        bigNumberStrings: false,
        entities: [__dirname + '/../../**/*.default.entity{.ts,.js}'], // 加载其他模块下 xxx.default.entity文件名的实体
      });
      return await defaultMySQLDataSource.initialize();
    },
  },
];
