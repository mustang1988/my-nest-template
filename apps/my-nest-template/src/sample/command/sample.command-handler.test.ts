import { basename } from 'node:path';
import { DataSource } from 'typeorm';
import { faker } from '@faker-js/faker';
import { randomUUID } from 'node:crypto';
import { SampleCommand } from './sample.command';
import { MySQLModule } from 'src/mysql/mysql.module';
import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from 'src/logger/logger.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SampleEntity } from '../entity/sample.default.entity';
import { SampleCommandHandler } from './sample.command-handler';
import { getMySQLDataSourceToken } from 'src/mysql/mysql.constant';
import configurationLoader from 'src/configuration/configuration-loader';
import { IMySQLConfiguration } from 'src/configuration/interface/mysql-configuration.interface';

describe(basename(__filename), () => {
  let dataSource: DataSource;
  let testingModule: TestingModule;
  let testHandler: SampleCommandHandler;
  /**
   * 测试过程中创建的示例数据ID, 用于测试结束后清理
   */
  const createdSampleIds: Array<number> = [];

  beforeAll(async () => {
    testingModule = await Test.createTestingModule({
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
      providers: [SampleCommandHandler],
    }).compile();
    testHandler = testingModule.get(SampleCommandHandler);
    dataSource = testingModule.get<DataSource>(getMySQLDataSourceToken('default'));
  });

  afterAll(async () => {
    /**
     * 清理测试创建的示例数据
     */
    await dataSource.getRepository(SampleEntity).delete(createdSampleIds);
    await testingModule.close();
  });

  describe('execute()', () => {
    it('正常', async () => {
      const command = new SampleCommand(randomUUID(), faker.lorem.word());
      const result = await testHandler.execute(command);
      expect(result);
      expect(result.id);
      expect(result.name).toStrictEqual(command.name);
      createdSampleIds.push(result.id);
    });
  });
});
