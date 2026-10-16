import { basename } from 'node:path';
import { faker } from '@faker-js/faker';
import { DataMaskingUtil } from './data-masking.util';
import { IDataMaskingOptions } from '../interface/data-masking-options.interface';

describe(basename(__filename), () => {
  it('maskingString()', () => {
    const inputStr = faker.lorem.paragraph();
    const result = DataMaskingUtil.maskingString(inputStr);
    expect(result.includes('*'));
  });

  it('maskingString()', () => {
    const inputStr = faker.lorem.paragraph();
    const options: IDataMaskingOptions = { percent: 200 };
    const result = DataMaskingUtil.maskingString(inputStr, options);
    expect(result.replace(/\*/g, '') === '');
  });

  it('maskingObject()', () => {
    const inputObj = { username: faker.lorem.word(), password: faker.lorem.word() };
    const result = DataMaskingUtil.maskingObject(inputObj);
    expect(result).toStrictEqual(inputObj);
  });

  it('maskingObject()', () => {
    const inputObj = { username: faker.lorem.word(), password: faker.lorem.word() };
    const options: IDataMaskingOptions = { fields: ['password', faker.lorem.word()] };
    const result = DataMaskingUtil.maskingObject(inputObj, options);
    expect(result).not.toStrictEqual(inputObj);
    expect(result.username).toStrictEqual(inputObj.username);
    expect(result.password).not.toStrictEqual(inputObj.password);
  });
});
