import {
  CLS_REQUEST_ID,
  CLS_INSTANCE_ID,
  CLS_REQUEST_BODY,
  CLS_REQUEST_PARAM,
  CLS_REQUEST_QUERY,
  CLS_REQUEST_COOKIE,
  CLS_REQUEST_HEADER,
} from '../context.constant';
import { basename } from 'node:path';
import { ClsService } from 'nestjs-cls';
import { faker } from '@faker-js/faker';
import { randomUUID } from 'node:crypto';
import { ContextModule } from '../context.module';
import { ContextService } from './context.service';
import { Test, TestingModule } from '@nestjs/testing';
import { ContextStore } from '../interface/context-store.interface';
import { ContextRequest } from '../interface/context-request.interface';

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

  describe('getAll()', () => {
    it('无值', () => {
      const result = contextService.getAll();
      expect(result);
    });

    it('有值', () => {
      const requestId = randomUUID();
      const store: ContextStore = {
        [CLS_REQUEST_ID]: requestId,
      };
      const result = clsService.runWith(store, () => contextService.getAll());
      expect(result);
      expect(result[CLS_REQUEST_ID]).toStrictEqual(requestId);
    });
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

  describe('getRequest()', () => {
    it('无值', () => {
      const result: ContextRequest = contextService.getRequest();
      expect(result);
      expect(result).toStrictEqual({ body: undefined, query: undefined, param: undefined, header: undefined, cookie: undefined });
    });

    it('有值', () => {
      const body = { id: faker.number.int({ min: 1, max: 5 }) };
      const store: ContextStore = {
        [CLS_REQUEST_BODY]: body,
      };
      const result = clsService.runWith(store, () => contextService.getRequest());
      expect(result);
      expect(result.body).toStrictEqual(body);
    });
  });

  describe('getRequestBody()', () => {
    it('无值', () => {
      const result = contextService.getRequestBody();
      expect(result).toStrictEqual(undefined);
    });

    it('有值', () => {
      const body = { id: faker.number.int({ min: 1, max: 5 }) };
      const store: ContextStore = {
        [CLS_REQUEST_BODY]: body,
      };
      const result = clsService.runWith(store, () => contextService.getRequestBody());
      expect(result).toStrictEqual(body);
    });
  });

  describe('getRequestParam()', () => {
    it('无值', () => {
      const result = contextService.getRequestParam();
      expect(result).toStrictEqual(undefined);
    });

    it('有值', () => {
      const params = { id: faker.number.int({ min: 1, max: 5 }) };
      const store: ContextStore = {
        [CLS_REQUEST_PARAM]: params,
      };
      const result = clsService.runWith(store, () => contextService.getRequestParam());
      expect(result).toStrictEqual(params);
    });
  });

  describe('getRequestQuery()', () => {
    it('无值', () => {
      const result = contextService.getRequestQuery();
      expect(result).toStrictEqual(undefined);
    });

    it('有值', () => {
      const query = { id: faker.number.int({ min: 1, max: 5 }) };
      const store: ContextStore = {
        [CLS_REQUEST_QUERY]: query,
      };
      const result = clsService.runWith(store, () => contextService.getRequestQuery());
      expect(result).toStrictEqual(query);
    });
  });

  describe('getRequestHeader()', () => {
    it('无值', () => {
      const result = contextService.getRequestHeader();
      expect(result).toStrictEqual(undefined);
    });

    it('有值', () => {
      const header = { id: faker.number.int({ min: 1, max: 5 }) };
      const store: ContextStore = {
        [CLS_REQUEST_HEADER]: header,
      };
      const result = clsService.runWith(store, () => contextService.getRequestHeader());
      expect(result).toStrictEqual(header);
    });
  });

  describe('getRequestCookie()', () => {
    it('无值', () => {
      const result = contextService.getRequestCookie();
      expect(result).toStrictEqual(undefined);
    });

    it('有值', () => {
      const cookie = { id: faker.number.int({ min: 1, max: 5 }) };
      const store: ContextStore = {
        [CLS_REQUEST_COOKIE]: cookie,
      };
      const result = clsService.runWith(store, () => contextService.getRequestCookie());
      expect(result).toStrictEqual(cookie);
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
