import { basename } from 'node:path';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { MySQLModule } from '../mysql.module';
import { InjectRepo } from './inject-repo.decorator';
import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from 'src/logger/logger.module';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { SampleEntity } from 'src/sample/entity/sample.default.entity';
import configurationLoader from 'src/configuration/configuration-loader';
import { IMySQLConfiguration } from 'src/configuration/interface/mysql-configuration.interface';

@Injectable()
class TestClass {
  constructor(@InjectRepo('default', SampleEntity) public readonly sampleRepo: Repository<SampleEntity>) {}
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
    expect(testInstance.sampleRepo);
    expect(testInstance.sampleRepo instanceof Repository);
    expect(testInstance.sampleRepo.metadata.target).toStrictEqual(SampleEntity);
  });
});
