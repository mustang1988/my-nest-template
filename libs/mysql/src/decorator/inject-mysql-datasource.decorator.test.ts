import { basename } from 'node:path';
import { DataSource } from 'typeorm';
import { LoggerModule } from '@pgu/logger';
import { Injectable } from '@nestjs/common';
import { MySQLModule } from '../mysql.module';
import { Test, TestingModule } from '@nestjs/testing';
import { IMySQLConfiguration } from '@pgu/configuration';
import { ConfigService, ConfigModule } from '@nestjs/config';
import configurationLoader from '@pgu/configuration/configuration-loader';
import { InjectMySQLDataSource } from './inject-mysql-datasource.decorator';

@Injectable()
class TestClass {
  constructor(@InjectMySQLDataSource('default') public readonly defaultMySQLDataSource: DataSource) {}
}

describe(basename(__filename), () => {
  let testInstance: TestClass;
  let mysqlModule: TestingModule;

  beforeAll(async () => {
    mysqlModule = await Test.createTestingModule({
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
  });

  afterAll(async () => {
    await mysqlModule.close();
  });

  it('constructor()', () => {
    testInstance = mysqlModule.get(TestClass);
    expect(testInstance.defaultMySQLDataSource);
    expect(testInstance.defaultMySQLDataSource instanceof DataSource);
  });
});
