import { DateTime } from 'luxon';
import { ValueTransformer } from 'typeorm';
import { IDateTimeValueTransformerOptions } from '../interface/datetime-value-transformer-options';

/**
 * datetime类型字段值转换器
 */
export class DatetimeValueTransformer implements ValueTransformer {
  /**
   * 日期时间输出格式
   */
  private readonly format: string;

  /**
   * 时区
   */
  private readonly zone: string;

  constructor(options?: IDateTimeValueTransformerOptions) {
    this.format = options?.format ?? 'yyyy-MM-dd HH:mm:ss.SSS';
    this.zone = options?.zone ?? 'UTC+8';
  }

  /**
   * 数据值保存入库前处理
   * @param value 即将保存入库的数据值
   * @return 转换后的入库的数据值
   */
  to(value: Date | null): Date | null {
    return value;
  }

  /**
   * 数据库查询值返回前处理
   * @param value 数据库查询返回值
   * @return 转换后的查询返回值
   */
  from(value: Date | null): string | null {
    return value instanceof Date ? DateTime.fromJSDate(value, { zone: this.zone }).toFormat(this.format) : value;
  }
}
