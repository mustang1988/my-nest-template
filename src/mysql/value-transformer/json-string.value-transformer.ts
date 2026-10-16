import { ValueTransformer } from 'typeorm';
import { IJsonValueTransFormerOptions } from '../interface/json-value-transformer-options.interface';

/**
 * json字符串字段值转换器
 */
export class JsonStringValueTransformer implements ValueTransformer {
  private readonly fallbackError: boolean;
  private readonly fallbaclValue: unknown;

  constructor(options?: IJsonValueTransFormerOptions) {
    this.fallbackError = options?.fallbackError ?? true;
    this.fallbaclValue = options?.fallbackValue ?? null;
  }

  to(value: string | null): string | null {
    return value;
  }

  from(value: string | null): unknown | null {
    if (value === null) {
      return null;
    }
    if (value === '') {
      return {};
    }
    try {
      return JSON.parse(value);
    } catch (error) {
      if (this.fallbackError) {
        throw new JsonStringValueTransformer(error.message);
      } else {
        return this.fallbaclValue;
      }
    }
  }
}
