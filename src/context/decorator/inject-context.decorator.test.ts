import { basename } from 'node:path';
import { Test } from '@nestjs/testing';
import { Inject } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { ContextModule } from '../context.module';
import { InjectContext } from './inject-context.decorator';
import { ContextService } from '../service/context.service';

class TestClass {
  constructor(@Inject() private readonly ctx: ContextService) {}
  @InjectContext()
  async testCase1(): Promise<string> {
    return this.ctx.getRequestId();
  }

  @InjectContext()
  async testCase2(args: { requestId: string }): Promise<boolean> {
    return args.requestId === this.ctx.getRequestId();
  }

  @InjectContext('id')
  async testCase3(args: { id: string }): Promise<boolean> {
    return args.id === this.ctx.getRequestId();
  }
}

describe(basename(__filename), () => {
  let testService: TestClass;

  beforeAll(async () => {
    const contextModule = await Test.createTestingModule({ imports: [ContextModule], providers: [TestClass] }).compile();
    expect(contextModule);
    testService = contextModule.get(TestClass);
  });

  describe('@InjectContext()', () => {
    it('无入参, 自动生成RequestId', async () => {
      const result = await testService.testCase1();
      expect(result);
    });

    it('有入参, 使用入参的RequestId', async () => {
      const requestId = randomUUID();
      const result = await testService.testCase2({ requestId });
      expect(result).toStrictEqual(true);
    });

    it('有入参, 指定字段', async () => {
      const requestId = randomUUID();
      const result = await testService.testCase3({ id: requestId });
      expect(result).toStrictEqual(true);
    });
  });
});
