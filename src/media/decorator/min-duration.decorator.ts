import { registerDecorator, ValidationOptions } from 'class-validator';
import { MinDurationValidator } from '../validator/min-duration.validator';

/**
 * 媒体时长最小值校验器装饰器
 * @param minDurationInSecond 最小时长, 单位: 秒
 * @param options 校验选项
 */
export const MinDuration = (minDurationInSecond: number, options?: ValidationOptions) => (dto: object, propertyName: string) =>
  registerDecorator({ target: dto.constructor, propertyName, options, constraints: [minDurationInSecond], validator: MinDurationValidator });
