import { basename } from 'node:path';
import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { MySQLModule } from '../mysql.module';
import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from 'src/logger/logger.module';
import { ConfigService, ConfigModule } from '@nestjs/config';
import configurationLoader from 'src/configuration/configuration-loader';
import { InjectMySQLDataSource } from './inject-mysql-datasource.decorator';
import { IMySQLConfiguration } from 'src/configuration/interface/mysql-configuration.interface';

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

  it('constructor()', () => {
    testInstance = mysqlModule.get(TestClass);
    expect(testInstance.defaultMySQLDataSource);
    expect(testInstance.defaultMySQLDataSource instanceof DataSource);
  });
});
