import { basename } from 'node:path';
import { ClsService } from 'nestjs-cls';
import { faker } from '@faker-js/faker';
import { randomUUID } from 'node:crypto';
import { ContextModule } from '../context.module';
import { ContextService } from './context.service';
import { Test, TestingModule } from '@nestjs/testing';
import { CLS_INSTANCE_ID, CLS_REQUEST_ID } from '../context.constant';

describe(basename(__filename), () => {
  let contextService: ContextService;
  let contextModule: TestingModule;
  let clsService: ClsService;

  beforeAll(async () => {
    contextModule = await Test.createTestingModule({ imports: [ContextModule] }).compile();
    clsService = contextModule.get(ClsService);
  });

  it('constructor()', () => {
    contextService = contextModule.get(ContextService);
    expect(contextService);
  });

  describe('getRequestId()', () => {
    it('undefined', () => {
      const result = contextService.getRequestId();
      expect(result).toStrictEqual(undefined);
    });

    it('normal', () => {
      const requestId = randomUUID();
      const result = clsService.runWith({ [CLS_REQUEST_ID]: requestId }, () => contextService.getRequestId());
      expect(result).toStrictEqual(requestId);
    });
  });

  describe('getInstanceId()', () => {
    it('undefined', () => {
      const result = contextService.getInstanceId();
      expect(result).toStrictEqual(undefined);
    });

    it('normal', () => {
      const instanceId = faker.number.int({ min: 0, max: 100 });
      const result = clsService.runWith({ [CLS_INSTANCE_ID]: instanceId }, () => contextService.getInstanceId());
      expect(result).toStrictEqual(instanceId);
    });
  });

  it('getCtxValue(), getCtxValue()', () => {
    const key = faker.lorem.word();
    const value = faker.lorem.word();
    const result = clsService.runWith({}, () => {
      contextService.setCtxValue(key, value);
      return contextService.getCtxValue(key);
    });
    expect(result).toStrictEqual(value);
  });

  describe('setCtxValueIfUndefined()', () => {
    it('true', () => {
      const key = faker.lorem.word();
      const value = faker.lorem.word();
      const result = clsService.runWith({}, () => {
        return contextService.setCtxValueIfUndefined(key, value);
      });
      expect(result).toStrictEqual(true);
    });

    it('false', () => {
      const key = faker.lorem.word();
      const value = faker.lorem.word();
      const result = clsService.runWith({ [key]: value }, () => {
        return contextService.setCtxValueIfUndefined(key, faker.lorem.text());
      });
      expect(result).toStrictEqual(false);
    });
  });
});
