import { basename } from 'node:path';
import { faker } from '@faker-js/faker';
import { randomUUID } from 'node:crypto';
import { BaseMessage } from '../message/base.message';
import { RabbitmqMessagePipe } from './rabbitmq-message.pipe';
import { MessageDeserializationException } from '../exception/message-deserialization.exception';

describe(basename(__filename), () => {
  const testPipe = new RabbitmqMessagePipe(BaseMessage);

  describe('transform()', () => {
    it('input message instance', () => {
      const input = new BaseMessage(randomUUID(), faker.lorem.word());
      const result = testPipe.transform(input);
      expect(result);
      expect(result).toStrictEqual(input);
    });

    describe('input string', () => {
      it('normal', () => {
        const input = JSON.stringify({ requestId: randomUUID(), pattern: faker.lorem.word() });
        const result = testPipe.transform(input);
        expect(result);
      });

      it('missing required requestid', () => {
        const input = JSON.stringify({ pattern: faker.lorem.word() });
        try {
          testPipe.transform(input);
        } catch (error) {
          expect(error);
          expect(error instanceof MessageDeserializationException);
        }
      });

      it('missing required pattern', () => {
        const input = JSON.stringify({ pattern: faker.lorem.word() });
        try {
          testPipe.transform(input);
        } catch (error) {
          expect(error);
          expect(error instanceof MessageDeserializationException);
        }
      });

      it('invalid', () => {
        const input = faker.lorem.text();
        try {
          testPipe.transform(input);
        } catch (error) {
          expect(error);
          expect(error instanceof MessageDeserializationException);
        }
      });
    });

    describe('input object', () => {
      it('normal', () => {
        const input = { requestId: randomUUID(), pattern: faker.lorem.word() };
        const result = testPipe.transform(input);
        expect(result);
      });

      it('missing required requestId', () => {
        try {
          const input = { pattern: faker.lorem.word() };
          testPipe.transform(input);
        } catch (error) {
          expect(error);
          expect(error instanceof MessageDeserializationException);
        }
      });

      it('missing required eventName', () => {
        try {
          const input = { requestId: randomUUID() };
          testPipe.transform(input);
        } catch (error) {
          expect(error);
          expect(error instanceof MessageDeserializationException);
        }
      });

      it('invalid', () => {
        try {
          testPipe.transform({});
        } catch (error) {
          expect(error);
          expect(error instanceof MessageDeserializationException);
        }
      });
    });

    describe('不支持的消息内容', () => {
      it('input number', () => {
        try {
          testPipe.transform(1);
        } catch (error) {
          expect(error);
          expect(error instanceof MessageDeserializationException);
        }
      });

      it('input boolean', () => {
        try {
          testPipe.transform(false);
        } catch (error) {
          expect(error);
          expect(error instanceof MessageDeserializationException);
        }
      });
    });
  });
});
