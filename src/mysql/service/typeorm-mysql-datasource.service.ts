import { DataSource } from 'typeorm';
import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DEFAULT_MYSQL_DATASOURCE } from '../mysql.constant';
import { IMySQLConfiguration } from '../../configuration/interface/mysql-configuration.interface';

export const mysqlDataSources: Array<Provider> = [
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
        logging: defaultMySQLConfig.logger,
        logger: 'formatted-console',
        bigNumberStrings: false,
        entities: [__dirname + '/../../**/*.default.entity{.ts,.js}'],
      });
      return await defaultMySQLDataSource.initialize();
    },
  },
];
