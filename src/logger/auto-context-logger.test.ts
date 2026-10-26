import { Logger } from 'winston';
import { basename } from 'node:path';
import { Injectable } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { AutoContextLogger, WithAutoContextLogger } from './auto-context-logger';

/**
 * 不需要日志能力的业务基类(模拟场景: 需要输出日志的类必须继承此基类)
 */
class BusinessBase {
  businessValue = 'business';
}

/**
 * 通过Mixin将自动上下文日志能力混入BusinessBase
 */
@Injectable()
class MixinFormService extends WithAutoContextLogger(BusinessBase) {
  doLog(): void {
    this.logger.info('test message');
  }
}

/**
 * 通过基类形式获得自动上下文日志能力
 */
@Injectable()
class BaseFormService extends AutoContextLogger {
  doLog(): void {
    this.logger.info('test message');
  }
}

describe(basename(__filename), () => {
  let testingModule: TestingModule;
  /**
   * 根日志实例存根: 记录child()调用时的context参数, 用于断言子日志实例携带的上下文
   */
  const createdChildContexts: Array<string> = [];
  const rootLoggerStub = {
    child: (options: { context: string }) => {
      createdChildContexts.push(options.context);
      return { context: options.context, info: jest.fn() } as unknown as Logger;
    },
  } as unknown as Logger;

  beforeAll(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        { provide: WINSTON_MODULE_PROVIDER, useValue: rootLoggerStub },
        MixinFormService,
        BaseFormService,
      ],
    }).compile();
  });

  describe('WithAutoContextLogger()', () => {
    it('混入业务基类后logger自动携带当前类名上下文', () => {
      const service = testingModule.get(MixinFormService);
      service.doLog();
      expect(createdChildContexts).toContain('MixinFormService');
    });

    it('原业务基类未被修改', () => {
      /**
       * logger成员应定义在Mixin返回的派生类原型上, 而非原基类原型上
       */
      expect('logger' in BusinessBase.prototype).toStrictEqual(false);
    });
  });

  describe('AutoContextLogger', () => {
    it('继承基类后logger自动携带当前类名上下文', () => {
      const service = testingModule.get(BaseFormService);
      service.doLog();
      expect(createdChildContexts).toContain('BaseFormService');
    });
  });

  afterAll(async () => {
    await testingModule.close();
  });
});
