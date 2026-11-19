import { basename } from 'node:path';
import { faker } from '@faker-js/faker';
import { randomUUID } from 'node:crypto';
import { LoggerModule } from '@pgu/logger';
import { SampleQuery } from './sample.query';
import { DataSource, Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { IMySQLConfiguration } from '@pgu/configuration';
import { SampleQueryHandler } from './sample.query-handler';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SampleEntity } from '../entity/sample.default.entity';
import { getMySQLDataSourceToken, MySQLModule } from '@pgu/mysql';
import { InternationalizationModule } from '@pgu/internationalization';
import configurationLoader from '@pgu/configuration/configuration-loader';

describe(basename(__filename), () => {
  let testingModule: TestingModule;
  let testHandler: SampleQueryHandler;
  let sampleRepo: Repository<SampleEntity>;
  /**
   * 测试过程中创建的示例数据ID, 用于测试结束后清理
   */
  const createdSampleIds: Array<number> = [];

  beforeAll(async () => {
    testingModule = await Test.createTestingModule({
      imports: [
        LoggerModule,
        InternationalizationModule,
        MySQLModule.forRootAsync({
          useFactory: (configService: ConfigService) => {
            const mysqlConfig = configService.getOrThrow<Record<string, Required<IMySQLConfiguration>>>('mysql');
            return Object.keys(mysqlConfig).map((name) => ({ name, ...mysqlConfig[name] }));
          },
        }),
        ConfigModule.forRoot({ isGlobal: true, load: [configurationLoader], ignoreEnvFile: true }),
      ],
      providers: [SampleQueryHandler],
    }).compile();
    testHandler = testingModule.get(SampleQueryHandler);
    const dataSource = testingModule.get<DataSource>(getMySQLDataSourceToken('default'));
    sampleRepo = dataSource.getRepository(SampleEntity);
  });

  describe('execute()', () => {
    it('查询存在的数据', async () => {
      /**
       * 先创建一条数据确保存在
       */
      const createdSample = await sampleRepo.save(sampleRepo.create({ name: faker.lorem.word() }));
      createdSampleIds.push(createdSample.id);
      const query = new SampleQuery(randomUUID(), createdSample.id);
      const result = await testHandler.execute(query);
      expect(result);
      expect(result.id).toStrictEqual(createdSample.id);
      expect(result.name).toStrictEqual(createdSample.name);
    });

    it('查询不存在的数据', async () => {
      /**
       * 创建后删除, 确保指定ID的数据不存在
       */
      const createdSample = await sampleRepo.save(sampleRepo.create({ name: faker.lorem.word() }));
      await sampleRepo.delete(createdSample.id);
      const query = new SampleQuery(randomUUID(), createdSample.id);
      try {
        await testHandler.execute(query);
      } catch (error) {
        expect(error);
        expect(error instanceof NotFoundException);
      }
    });
  });

  afterAll(async () => {
    /**
     * 清理测试创建的示例数据
     */
    await sampleRepo.delete(createdSampleIds);
    await testingModule.close();
  });
});
