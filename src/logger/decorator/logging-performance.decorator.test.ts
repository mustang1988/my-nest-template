import { basename } from 'node:path';
import { randomUUID } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from '../logger.module';
import { setTimeout } from 'node:timers/promises';
import { Test, TestingModule } from '@nestjs/testing';
import { ClsService, ClsServiceManager } from 'nestjs-cls';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { CLS_REQUEST_ID } from 'src/context/context.constant';
import { LoggingPerformance } from './logging-performance.decorator';
import configurationLoader from 'src/configuration/configuration-loader';
import { ContextStore } from 'src/context/interface/context-store.interface';

describe(basename(__filename), () => {
  @Injectable()
  class TestClass {
    @LoggingPerformance()
    test(): string {
      return randomUUID();
    }

    @LoggingPerformance({ threshold: 1 })
    async asyncTest(): Promise<string> {
      return 'hello';
    }

    @LoggingPerformance()
    async asyncTest2(): Promise<string> {
      return await setTimeout(100, 'hello');
    }
  }

  let loggerModule: TestingModule;
  let testInstance: TestClass;
  let cls: ClsService;
  const clsStore: ContextStore = { [CLS_REQUEST_ID]: randomUUID() };

  beforeAll(async () => {
    loggerModule = await Test.createTestingModule({
      imports: [LoggerModule, ConfigModule.forRoot({ isGlobal: true, load: [configurationLoader], ignoreEnvFile: true })],
      providers: [TestClass],
    }).compile();
    expect(loggerModule);
    testInstance = loggerModule.get(TestClass);
    expect(testInstance);
    cls = ClsServiceManager.getClsService();
    expect(cls);
    loggerModule.useLogger(loggerModule.get(WINSTON_MODULE_NEST_PROVIDER));
  });

  it('test()', () => {
    const res = cls.runWith(clsStore, () => testInstance.test());
    expect(res);
  });

  it('asyncTest()', async () => {
    const res = await cls.runWith(clsStore, () => testInstance.asyncTest());
    expect(res).toStrictEqual('hello');
  });

  it('asyncTest2()', async () => {
    const res = await cls.runWith(clsStore, () => testInstance.asyncTest2());
    expect(res).toStrictEqual('hello');
  });
});
