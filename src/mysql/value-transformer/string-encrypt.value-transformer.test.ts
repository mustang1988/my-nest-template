import { isString } from 'lodash';
import { basename } from 'node:path';
import { faker } from '@faker-js/faker';
import { StringAesEncryptValueTransformer } from './string-encrypt.value-transformer';

describe(basename(__filename), () => {
  let testInstance: StringAesEncryptValueTransformer;
  const inputStr = faker.lorem.text();
  let encrypted: string;

  beforeEach(() => {
    testInstance = new StringAesEncryptValueTransformer();
  });

  it('to()', () => {
    const result = testInstance.to(null);
    expect(result).toStrictEqual(null);
  });

  it('to()', () => {
    const result = testInstance.to(inputStr);
    expect(result).not.toStrictEqual(null);
    expect(isString(result));
    console.log('to()\ninputStr: %s\nresult: %s', inputStr, result);
    encrypted = result as string;
  });

  it('from()', () => {
    const result = testInstance.from(null);
    expect(result).toStrictEqual(null);
  });

  it('from()', () => {
    const result = testInstance.from(encrypted);
    expect(result).toStrictEqual(inputStr);
    console.log('from()\nresult: %s\ninputStr: %s', result, inputStr);
  });
});
