import { isString } from 'lodash';
import { basename } from 'node:path';
import { faker } from '@faker-js/faker';
import { DatetimeValueTransformer } from './datetime.value-transformer';

describe(basename(__filename), () => {
  let testInstance: DatetimeValueTransformer;
  const inputDate = faker.date.anytime();

  beforeEach(() => {
    testInstance = new DatetimeValueTransformer();
  });

  it('to()', () => {
    const result = testInstance.to(null);
    expect(result).toStrictEqual(null);
  });

  it('to()', () => {
    const result = testInstance.to(inputDate);
    expect(result).toStrictEqual(inputDate);
  });

  it('from()', () => {
    const result = testInstance.from(null);
    expect(result).toStrictEqual(null);
  });

  it('from()', () => {
    const result = testInstance.from(inputDate);
    expect(isString(result));
  });

  it('to()', () => {
    testInstance = new DatetimeValueTransformer({ format: 'yyyy_MM_DD_HH_mm_ss_SSS' });
    const result = testInstance.to(inputDate);
    expect(result).toStrictEqual(inputDate);
  });

  it('from()', () => {
    testInstance = new DatetimeValueTransformer({ format: 'yyyy_MM_DD_HH_mm_ss_SSS' });
    const result = testInstance.from(inputDate);
    expect(isString(result));
    expect(result?.includes('_'));
  });
});
