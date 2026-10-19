import { basename } from 'node:path';
import { Test } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { MySQLModule } from './mysql.module';
import { LoggerModule } from 'src/logger/logger.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configurationLoader from 'src/configuration/configuration-loader';
import { IMySQLConfiguration } from 'src/configuration/interface/mysql-configuration.interface';
import { MySQLDataSourceNotFoundException } from './exception/mysql-datasource-not-found.exception';

describe(basename(__filename), () => {
  describe('forRootAsync()', () => {
    it('全默认', async () => {
      const mysqlModule = await Test.createTestingModule({
        imports: [
          LoggerModule,
          MySQLModule.forRootAsync({
            useFactory: (configService: ConfigService) => {
              const mysqlConfig = configService.getOrThrow<Record<string, Required<IMySQLConfiguration>>>('mysql');
              return Object.keys(mysqlConfig).map((name) => ({ name, ...mysqlConfig[name] }));
            },
          }),
          ConfigModule.forRoot({ isGlobal: true, load: [configurationLoader], ignoreEnvFile: true }),
        ],
      }).compile();
      expect(mysqlModule);
    });

    it('指定名称配置不初始化', async () => {
      const mysqlModule = await Test.createTestingModule({
        imports: [
          LoggerModule,
          MySQLModule.forRootAsync({
            useFactory: (configService: ConfigService) => {
              const mysqlConfig = configService.getOrThrow<Record<string, Required<IMySQLConfiguration>>>('mysql');
              const options = Object.keys(mysqlConfig).map((name) => ({ name, ...mysqlConfig[name] }));
              options.push({
                name: faker.lorem.word(),
                host: faker.internet.ipv4(),
                port: faker.internet.port(),
                username: faker.lorem.word(),
                password: faker.lorem.word(),
                database: faker.lorem.word(),
                charset: 'utf8',
                timezone: 'Z',
                enableLogger: faker.datatype.boolean(),
                enableSynchronize: faker.datatype.boolean(),
              });
              return options;
            },
          }),
          ConfigModule.forRoot({ isGlobal: true, load: [configurationLoader], ignoreEnvFile: true }),
        ],
      }).compile();
      expect(mysqlModule);
    });

    it('指定名称不存在', async () => {
      try {
        await Test.createTestingModule({
          imports: [
            LoggerModule,
            MySQLModule.forRootAsync({
              names: [faker.lorem.word()],
              useFactory: (configService: ConfigService) => {
                const mysqlConfig = configService.getOrThrow<Record<string, Required<IMySQLConfiguration>>>('mysql');
                return Object.keys(mysqlConfig).map((name) => ({ name, ...mysqlConfig[name] }));
              },
            }),
            ConfigModule.forRoot({ isGlobal: true, load: [configurationLoader], ignoreEnvFile: true }),
          ],
        }).compile();
      } catch (error) {
        expect(error);
        expect(error instanceof MySQLDataSourceNotFoundException);
      }
    });
  });
});
