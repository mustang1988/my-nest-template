import { basename } from 'node:path';
import { randomUUID } from 'node:crypto';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from '../logger.module';
import { setTimeout } from 'node:timers/promises';
import { Injectable, Logger } from '@nestjs/common';
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

    @LoggingPerformance()
    async asyncTest(): Promise<string> {
      return 'hello';
    }

    @LoggingPerformance()
    async asyncTest2(): Promise<string> {
      return await setTimeout(100, 'hello');
    }

    /**
     * 非async声明但返回Promise的函数(验证按返回值而非函数声明形式判断异步)
     */
    @LoggingPerformance()
    promiseTest(): Promise<string> {
      return setTimeout(100, 'world');
    }

    /**
     * 入参与返回值包含BigInt的函数(验证性能日志输出不会因序列化失败影响业务)
     */
    @LoggingPerformance()
    bigintTest(bigintArg: bigint): Promise<bigint> {
      return setTimeout(100, bigintArg + 1n);
    }
  }

  let loggerModule: TestingModule;
  let testInstance: TestClass;
  let cls: ClsService;
  let warnSpy: jest.SpyInstance;
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

  beforeEach(() => {
    warnSpy = jest.spyOn(Logger.prototype, 'warn');
  });

  afterEach(() => {
    warnSpy.mockRestore();
  });

  it('test(): 同步函数未超阈值, 不输出性能日志', () => {
    const res = cls.runWith(clsStore, () => testInstance.test());
    expect(res);
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it('asyncTest(): async函数未超阈值, 不输出性能日志', async () => {
    const res = await cls.runWith(clsStore, () => testInstance.asyncTest());
    expect(res).toStrictEqual('hello');
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it('asyncTest2(): async函数超过阈值, 输出性能日志', async () => {
    const res = await cls.runWith(clsStore, () => testInstance.asyncTest2());
    expect(res).toStrictEqual('hello');
    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(String(warnSpy.mock.calls[0]?.[0])).toContain('低性能方法执行');
  });

  it('promiseTest(): 非async声明但返回Promise的函数超过阈值, 输出性能日志', async () => {
    const res = await cls.runWith(clsStore, () => testInstance.promiseTest());
    expect(res).toStrictEqual('world');
    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(String(warnSpy.mock.calls[0]?.[0])).toContain('低性能方法执行');
  });

  it('bigintTest(): 入参与返回值包含BigInt, 正常返回且输出性能日志', async () => {
    const res = await cls.runWith(clsStore, () => testInstance.bigintTest(10n));
    expect(res).toStrictEqual(11n);
    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(String(warnSpy.mock.calls[0]?.[0])).toContain('低性能方法执行');
  });
});
