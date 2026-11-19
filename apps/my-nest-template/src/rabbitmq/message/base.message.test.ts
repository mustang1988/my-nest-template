import { isString } from 'lodash';
import { basename } from 'node:path';
import { faker } from '@faker-js/faker';
import { randomUUID } from 'node:crypto';
import { BaseMessage } from './base.message';
import { MessageDeserializationException } from '../exception/message-deserialization.exception';

describe(basename(__filename), () => {
  describe('constructor()', () => {
    it('全参数', () => {
      const requestId = randomUUID();
      const pattern = faker.lorem.word();
      const payload = { id: faker.number.int(), value: faker.lorem.text() };
      const message = new BaseMessage(requestId, pattern, payload);
      expect(message);
    });

    it('仅必填参数', () => {
      const requestId = randomUUID();
      const pattern = faker.lorem.word();
      const message = new BaseMessage(requestId, pattern);
      expect(message);
    });
  });

  it('toString()', () => {
    const requestId = randomUUID();
    const pattern = faker.lorem.word();
    const payload = { id: faker.number.int(), value: faker.lorem.text() };
    const message = new BaseMessage(requestId, pattern, payload);
    const result = message.toString();
    expect(result);
    expect(isString(result));
  });

  describe('fromString()', () => {
    it('normal', () => {
      const requestId = randomUUID();
      const eventName = faker.lorem.word();
      const payload = { id: faker.number.int({ min: 0, max: 100 }), value: faker.lorem.text() };
      const event = new BaseMessage(requestId, eventName, payload);
      const stringData = event.toString();
      const result = BaseMessage.fromString(stringData);
      expect(result);
    });

    it('missing required requestId', () => {
      const stringData = JSON.stringify({ value: faker.lorem.text() });
      try {
        BaseMessage.fromString(stringData);
      } catch (error) {
        expect(error);
        expect(error instanceof MessageDeserializationException);
      }
    });

    it('missing required eventName', () => {
      const stringData = JSON.stringify({ requestId: randomUUID() });
      try {
        BaseMessage.fromString(stringData);
      } catch (error) {
        expect(error);
        expect(error instanceof MessageDeserializationException);
      }
    });

    it('invalid', () => {
      const stringData = faker.lorem.text();
      try {
        BaseMessage.fromString(stringData);
      } catch (error) {
        expect(error);
        expect(error instanceof MessageDeserializationException);
      }
    });
  });

  describe('fromObject()', () => {
    it('normal', () => {
      const requestId = randomUUID();
      const eventName = faker.lorem.word();
      const payload = { id: faker.number.int({ min: 0, max: 100 }), value: faker.lorem.text() };
      const event = new BaseMessage(requestId, eventName, payload);
      const objData = JSON.parse(event.toString());
      const result = BaseMessage.fromObject(objData);
      expect(result);
    });

    it('missing required requestId', () => {
      const objData = { id: faker.number.int({ min: 1, max: 100 }) };
      try {
        BaseMessage.fromObject(objData);
      } catch (error) {
        expect(error);
        expect(error instanceof MessageDeserializationException);
      }
    });

    it('missing required eventName', () => {
      const objData = { requestId: randomUUID() };
      try {
        BaseMessage.fromObject(objData);
      } catch (error) {
        expect(error);
        expect(error instanceof MessageDeserializationException);
      }
    });
  });
});
