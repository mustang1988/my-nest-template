import { ValueTransformer } from 'typeorm';

/**
 * json字符串字段值转换器
 */
export class JsonStringValueTransformer implements ValueTransformer {
  to(value: string | null): string | null {
    return value;
  }

  from(value: string | null): unknown {
    return value === null ? null : (JSON.parse(value) as unknown);
  }
}
