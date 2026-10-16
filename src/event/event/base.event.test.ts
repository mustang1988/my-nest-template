import { basename } from 'node:path';
import { faker } from '@faker-js/faker';
import { BaseEvent } from './base.event';
import { randomUUID } from 'node:crypto';
import { EventDeserializationException } from '../exception/event-deserialization.exception';

describe(basename(__filename), () => {
  describe('constructor()', () => {
    it('only required', () => {
      const requestId = randomUUID();
      const eventName = faker.lorem.word();
      const event = new BaseEvent(requestId, eventName);
      expect(event);
    });

    it('full args', () => {
      const requestId = randomUUID();
      const eventName = faker.lorem.word();
      const payload = { id: faker.number.int({ min: 0, max: 100 }), value: faker.lorem.text() };
      const event = new BaseEvent(requestId, eventName, payload);
      expect(event);
    });
  });

  it('toString()', () => {
    const requestId = randomUUID();
    const eventName = faker.lorem.word();
    const payload = { id: faker.number.int({ min: 0, max: 100 }), value: faker.lorem.text() };
    const event = new BaseEvent(requestId, eventName, payload);
    const result = event.toString();
    expect(result);
  });

  describe('fromString()', () => {
    it('normal', () => {
      const requestId = randomUUID();
      const eventName = faker.lorem.word();
      const payload = { id: faker.number.int({ min: 0, max: 100 }), value: faker.lorem.text() };
      const event = new BaseEvent(requestId, eventName, payload);
      const stringData = event.toString();
      const result = BaseEvent.fromString(stringData);
      expect(result);
    });

    it('missing required requestId', () => {
      const stringData = JSON.stringify({ value: faker.lorem.text() });
      try {
        BaseEvent.fromString(stringData);
      } catch (error) {
        expect(error);
        expect(error instanceof EventDeserializationException);
      }
    });

    it('missing required eventName', () => {
      const stringData = JSON.stringify({ requestId: randomUUID() });
      try {
        BaseEvent.fromString(stringData);
      } catch (error) {
        expect(error);
        expect(error instanceof EventDeserializationException);
      }
    });

    it('invalid', () => {
      const stringData = faker.lorem.text();
      try {
        BaseEvent.fromString(stringData);
      } catch (error) {
        expect(error);
        expect(error instanceof EventDeserializationException);
      }
    });
  });

  describe('fromObject()', () => {
    it('normal', () => {
      const requestId = randomUUID();
      const eventName = faker.lorem.word();
      const payload = { id: faker.number.int({ min: 0, max: 100 }), value: faker.lorem.text() };
      const event = new BaseEvent(requestId, eventName, payload);
      const objData = JSON.parse(event.toString());
      const result = BaseEvent.fromObject(objData);
      expect(result);
    });

    it('missing required requestId', () => {
      const objData = { id: faker.number.int({ min: 1, max: 100 }) };
      try {
        BaseEvent.fromObject(objData);
      } catch (error) {
        expect(error);
        expect(error instanceof EventDeserializationException);
      }
    });

    it('missing required eventName', () => {
      const objData = { requestId: randomUUID() };
      try {
        BaseEvent.fromObject(objData);
      } catch (error) {
        expect(error);
        expect(error instanceof EventDeserializationException);
      }
    });
  });
});
