import { basename } from 'node:path';
import { DataSource } from 'typeorm';
import { Test } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { MySQLModule } from './mysql.module';
import { LoggerModule } from 'src/logger/logger.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configurationLoader from 'src/configuration/configuration-loader';
import { InjectMySQLDataSource } from './decorator/inject-mysql-datasource.decorator';
import { IMySQLConfiguration } from 'src/configuration/interface/mysql-configuration.interface';
import { MySQLDataSourceNotFoundException } from './exception/mysql-datasource-not-found.exception';

/**
 * 注册表登记用测试类: 使'default'连接进入@InjectMySQLDataSource()装饰器注册表, 令forRootAsync()针对性初始化'default'连接
 */
@Injectable()
class TestClass {
  constructor(@InjectMySQLDataSource('default') public readonly defaultMySQLDataSource: DataSource) {}
}

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
        providers: [TestClass],
      }).compile();
      expect(mysqlModule);
      const testInstance = mysqlModule.get(TestClass);
      expect(testInstance.defaultMySQLDataSource);
      await mysqlModule.close();
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
                poolSize: faker.number.int({ min: 1, max: 10 }),
              });
              return options;
            },
          }),
          ConfigModule.forRoot({ isGlobal: true, load: [configurationLoader], ignoreEnvFile: true }),
        ],
      }).compile();
      expect(mysqlModule);
      await mysqlModule.close();
    });

    it('指定名称不存在', async () => {
      /**
       * 先通过装饰器登记随机名称, 使对应Provider被注册(配置中不存在该名称的连接, Provider工厂初始化时应抛出异常)
       */
      const notExistsName = faker.lorem.word();
      InjectMySQLDataSource(notExistsName);
      try {
        await Test.createTestingModule({
          imports: [
            LoggerModule,
            MySQLModule.forRootAsync({
              names: [notExistsName], // 随机名称
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
