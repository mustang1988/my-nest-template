import { get, set, isString } from 'lodash';
import { IDataMaskingOptions } from '../interface/data-masking-options.interface';

/**
 * 数据脱敏工具类
 */
export class DataMaskingUtil {
  /**
   * 字符串脱敏
   *
   * 将给定字符串中部分内容替换为占位符
   *
   * @param input 输入字符串
   * @param options 脱敏选项
   * @return 脱敏后的字符串
   * @example
   * ```typescript
   * const str = 'password';
   * const result = DataMaskingUtil.maskingString(str); // 'pass*****'
   * ```
   */
  static maskingString(input: string, options?: IDataMaskingOptions): string {
    const percent = Math.min(options?.percent ?? 50, 100);
    const maskingLength = Math.ceil((input.length * percent) / 100);
    return input.substring(0, input.length - maskingLength).padEnd(input.length, options?.placeholder ?? '*');
  }

  /**
   * 对象数据脱敏
   *
   * 将给对象中指定字段的字符串中部分内容替换为占位符
   *
   * @param input 输入对象
   * @param options 脱敏选项
   * @return 脱敏后的对象
   * @example
   * ```typescript
   * const obj = {username:'root', password:'dell_456'};
   * const result = DataMaskingUtil.maskingObject(obj,{fields:['username','password']}); // {username:'ro**', password:'dell****'}
   * ```
   */
  static maskingObject<T extends object>(input: T, options?: IDataMaskingOptions): T {
    const fields = options?.fields ?? [];
    for (const field of fields) {
      const fieldValue = get(input, field, undefined);
      if (fieldValue && isString(fieldValue)) {
        set(input, field, this.maskingString(fieldValue, options));
      }
    }
    return input;
  }
}
