import { isObject } from 'lodash';
import { basename } from 'node:path';
import { faker } from '@faker-js/faker';
import { JsonStringValueTransformer } from './json-string.value-transformer';
import { JsonValueTransformException } from '../exception/json-value-transfor.exception';

describe(basename(__filename), () => {
  let testInstance: JsonStringValueTransformer;
  const inputStr = JSON.stringify({ name: faker.lorem.word(), id: faker.number.int({ min: 1, max: 100 }) });

  beforeEach(() => {
    testInstance = new JsonStringValueTransformer();
  });

  it('to()', () => {
    const result = testInstance.to(null);
    expect(result).toStrictEqual(null);
  });

  it('to()', () => {
    const result = testInstance.to(inputStr);
    expect(result).toStrictEqual(inputStr);
  });

  it('from()', () => {
    const result = testInstance.from(null);
    expect(result).toStrictEqual(null);
  });

  it('from()', () => {
    const result = testInstance.from('');
    expect(isObject(result));
    expect(result).toStrictEqual({});
  });

  it('from()', () => {
    try {
      testInstance.from(faker.lorem.text());
    } catch (error) {
      expect(error);
      expect(error instanceof JsonValueTransformException);
    }
  });

  it('from()', () => {
    const fallbackValue = faker.helpers.arrayElement([null, {}]);
    const testInstance = new JsonStringValueTransformer({ fallbackError: false, fallbackValue });
    const result = testInstance.from(faker.lorem.text());
    expect(result).toStrictEqual(fallbackValue);
  });

  it('from()', () => {
    const result = testInstance.from(inputStr);
    expect(isObject(result));
    expect(result).toStrictEqual(JSON.parse(inputStr));
  });
});
