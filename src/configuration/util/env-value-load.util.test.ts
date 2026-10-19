import { basename } from 'node:path';
import { faker } from '@faker-js/faker';
import { randomBytes } from 'node:crypto';
import {
  InvalidUrlEnvException,
  InvalidHexEnvException,
  InvalidNumberEnvException,
  InvalidBooleanEnvException,
  InvalidIntegerEnvException,
} from '../exception/invalid-env.exception';
import { EnvValueLoadUtil } from './env-value-load.util';
import { MissingRequiredEnvException } from '../exception/missing-required-env.exception';

describe(basename(__filename), () => {
  describe('loadOptionalString()', () => {
    it('未找到指定环境变量, 返回undefined', () => {
      const result = EnvValueLoadUtil.loadOptionalString(faker.lorem.word());
      expect(result).toStrictEqual(undefined);
    });

    it('未找到指定环境变量, 返回指定的默认值', () => {
      const defaultValue = faker.lorem.word();
      const result = EnvValueLoadUtil.loadOptionalString(faker.lorem.word(), defaultValue);
      expect(result).toStrictEqual(defaultValue);
    });
  });

  describe('loadRequiredString()', () => {
    it('未找到指定环境变量, 抛出MissingRequiredEnvException异常', () => {
      try {
        EnvValueLoadUtil.loadRequiredString(faker.lorem.word());
      } catch (error) {
        expect(error);
        expect(error instanceof MissingRequiredEnvException);
      }
    });

    it('正常', () => {
      const result = EnvValueLoadUtil.loadRequiredString('PATH');
      expect(result).toStrictEqual(process.env.PATH);
    });
  });

  describe('loadOptionalHexString()', () => {
    it('正常', () => {
      const result = EnvValueLoadUtil.loadOptionalHexString('UNIT_TEST_HEX');
      expect(result);
    });

    it('找到指定环境变量, 值非16进制', () => {
      try {
        EnvValueLoadUtil.loadOptionalHexString('UNIT_TEST_BOOLEAN');
      } catch (error) {
        expect(error);
        expect(error instanceof InvalidHexEnvException);
      }
    });

    it('未找到指定环境变量, 返回undefined', () => {
      const result = EnvValueLoadUtil.loadOptionalHexString(faker.lorem.word());
      expect(result).toStrictEqual(undefined);
    });

    it('未找到指定环境变量, 返回指定的默认值', () => {
      const defaultValue = randomBytes(32).toString('hex');
      const result = EnvValueLoadUtil.loadOptionalHexString(faker.lorem.word(), defaultValue);
      expect(result).toStrictEqual(defaultValue);
    });

    it('未找到指定环境变量, 默认值无效', () => {
      const defaultValue = faker.lorem.word();
      try {
        EnvValueLoadUtil.loadOptionalHexString(faker.lorem.word(), defaultValue);
      } catch (error) {
        expect(error);
        expect(error instanceof InvalidHexEnvException);
      }
    });
  });

  describe('loadRequiredHexString()', () => {
    it('正常', () => {
      const result = EnvValueLoadUtil.loadRequiredHexString('UNIT_TEST_HEX');
      expect(result).toStrictEqual(process.env.UNIT_TEST_HEX);
    });

    it('找到指定环境变量, 类型错误', () => {
      try {
        EnvValueLoadUtil.loadRequiredHexString('PATH');
      } catch (error) {
        expect(error);
        expect(error instanceof InvalidHexEnvException);
      }
    });

    it('未找到指定环境变量, 抛出MissingRequiredEnvException异常', () => {
      try {
        EnvValueLoadUtil.loadRequiredHexString(faker.lorem.word());
      } catch (error) {
        expect(error);
        expect(error instanceof MissingRequiredEnvException);
      }
    });
  });

  describe('loadOptionalInteger()', () => {
    it('正常', () => {
      const result = EnvValueLoadUtil.loadOptionalInteger('PM2_WORKERS');
      expect(result).toStrictEqual(Number(process.env.PM2_WORKERS));
    });

    it('未找到指定环境变量, 返回指定的默认值', () => {
      const defaultValue = faker.number.int({ min: 1, max: 100 });
      const result = EnvValueLoadUtil.loadOptionalInteger(faker.lorem.word(), defaultValue);
      expect(result).toStrictEqual(defaultValue);
    });

    it('找到指定环境变量, 值非整数', () => {
      try {
        EnvValueLoadUtil.loadOptionalInteger('UNIT_TEST_NUMBER');
      } catch (error) {
        expect(error);
        expect(error instanceof InvalidIntegerEnvException);
      }
    });

    it('未找到指定环境变量, 指定的默认值非整数', () => {
      const defaultValue = faker.number.float({ min: 1, max: 100 });
      try {
        EnvValueLoadUtil.loadOptionalInteger(faker.lorem.word(), defaultValue);
      } catch (error) {
        expect(error);
        expect(error instanceof InvalidIntegerEnvException);
      }
    });
  });

  describe('loadRequiredInteger()', () => {
    it('正常', () => {
      const result = EnvValueLoadUtil.loadRequiredInteger('UNIT_TEST_INT');
      expect(result).toStrictEqual(Number(process.env.UNIT_TEST_INT));
    });

    it('未找到指定环境变量, 抛出MissingRequiredEnvException异常', () => {
      try {
        EnvValueLoadUtil.loadRequiredInteger(faker.lorem.word());
      } catch (error) {
        expect(error);
        expect(error instanceof MissingRequiredEnvException);
      }
    });

    it('找到指定环境变量, 值非整数', () => {
      try {
        EnvValueLoadUtil.loadRequiredInteger('UNIT_TEST_NUMBER');
      } catch (error) {
        expect(error);
        expect(error instanceof InvalidIntegerEnvException);
      }
    });
  });

  describe('loadOptionalBoolean()', () => {
    it('正常', () => {
      const result = EnvValueLoadUtil.loadOptionalBoolean('UNIT_TEST_BOOLEAN');
      expect(result).toStrictEqual(process.env.UNIT_TEST_BOOLEAN === 'true');
    });

    it('找到指定环境变量, 值非布尔值', () => {
      try {
        EnvValueLoadUtil.loadOptionalBoolean('UNIT_TEST_URL');
      } catch (error) {
        expect(error);
        expect(error instanceof InvalidBooleanEnvException);
      }
    });

    it('未找到指定环境变量, 返回指定的默认值', () => {
      const defaultValue = faker.number.int({ min: 0, max: 1 }) === 0;
      const result = EnvValueLoadUtil.loadOptionalBoolean(faker.lorem.word(), defaultValue);
      expect(result).toStrictEqual(defaultValue);
    });
  });

  describe('loadRequiredBoolean()', () => {
    it('正常', () => {
      const result = EnvValueLoadUtil.loadRequiredBoolean('UNIT_TEST_BOOLEAN');
      expect(result).toStrictEqual(process.env.UNIT_TEST_BOOLEAN === 'true');
    });

    it('找到指定环境变量, 值非布尔值', () => {
      try {
        EnvValueLoadUtil.loadRequiredBoolean('UNIT_TEST_URL');
      } catch (error) {
        expect(error);
        expect(error instanceof InvalidBooleanEnvException);
      }
    });

    it('未找到指定环境变量', () => {
      try {
        EnvValueLoadUtil.loadRequiredBoolean(faker.lorem.word());
      } catch (error) {
        expect(error);
        expect(error instanceof MissingRequiredEnvException);
      }
    });
  });

  describe('loadOptionalNumber()', () => {
    it('正常', () => {
      const result = EnvValueLoadUtil.loadOptionalNumber('UNIT_TEST_NUMBER');
      expect(result).toStrictEqual(Number(process.env.UNIT_TEST_NUMBER));
    });

    it('未找到指定环境变量, 返回指定的默认值', () => {
      const defaultValue = faker.number.float({ min: 1, max: 100 });
      const result = EnvValueLoadUtil.loadOptionalNumber(faker.lorem.word(), defaultValue);
      expect(result).toStrictEqual(defaultValue);
    });

    it('找到指定环境变量, 值非数值', () => {
      try {
        EnvValueLoadUtil.loadOptionalNumber('UNIT_TEST_URL');
      } catch (error) {
        expect(error);
        expect(error instanceof InvalidNumberEnvException);
      }
    });
  });

  describe('loadRequiredNumber()', () => {
    it('正常', () => {
      const result = EnvValueLoadUtil.loadRequiredNumber('UNIT_TEST_NUMBER');
      expect(result).toStrictEqual(Number(process.env.UNIT_TEST_NUMBER));
    });

    it('未找到指定环境变量', () => {
      try {
        EnvValueLoadUtil.loadRequiredNumber(faker.lorem.word());
      } catch (error) {
        expect(error);
        expect(error instanceof MissingRequiredEnvException);
      }
    });

    it('找到指定环境变量, 值非数值', () => {
      try {
        EnvValueLoadUtil.loadRequiredNumber('UNIT_TEST_URL');
      } catch (error) {
        expect(error);
        expect(error instanceof InvalidNumberEnvException);
      }
    });
  });

  describe('loadOptionalUrl()', () => {
    it('正常', () => {
      const result = EnvValueLoadUtil.loadOptionalUrl('UNIT_TEST_URL');
      expect(result).toStrictEqual(process.env.UNIT_TEST_URL);
    });

    it('未找到指定环境变量, 返回指定的默认值', () => {
      const defaultValue = faker.internet.url();
      const result = EnvValueLoadUtil.loadOptionalUrl(faker.lorem.word(), defaultValue);
      expect(result).toStrictEqual(defaultValue);
    });

    it('未找到指定环境变量, 默认值非URL', () => {
      try {
        const defaultValue = faker.internet.ipv4();
        EnvValueLoadUtil.loadOptionalUrl(faker.lorem.word(), defaultValue);
      } catch (error) {
        expect(error);
        expect(error instanceof InvalidUrlEnvException);
      }
    });

    it('找到指定环境变量, 值非URL', () => {
      try {
        EnvValueLoadUtil.loadOptionalUrl('UNIT_TEST_NUMBER');
      } catch (error) {
        expect(error);
        expect(error instanceof InvalidUrlEnvException);
      }
    });
  });

  describe('loadRequiredUrl()', () => {
    it('正常', () => {
      const result = EnvValueLoadUtil.loadRequiredUrl('UNIT_TEST_URL');
      expect(result).toStrictEqual(process.env.UNIT_TEST_URL);
    });

    it('未找到指定环境变量', () => {
      try {
        EnvValueLoadUtil.loadRequiredUrl(faker.lorem.word());
      } catch (error) {
        expect(error);
        expect(error instanceof MissingRequiredEnvException);
      }
    });

    it('找到指定环境变量, 值非URL', () => {
      try {
        EnvValueLoadUtil.loadRequiredUrl('UNIT_TEST_BOOLEAN');
      } catch (error) {
        expect(error);
        expect(error instanceof InvalidUrlEnvException);
      }
    });
  });
});
