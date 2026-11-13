import { DurationValidator } from '../validator/duration.validator';
import { registerDecorator, ValidationOptions } from 'class-validator';

/**
 * 媒体时长校验器装饰器
 * @param minDuration 最小时长, 单位: 秒
 * @param maxDuration 最大时长, 单位: 秒
 * @param options 校验选项
 */
export const Duration = (minDuration: number, maxDuration: number, options?: ValidationOptions) => (dto: object, propertyName: string) =>
  registerDecorator({ target: dto.constructor, propertyName, options, constraints: [minDuration, maxDuration], validator: DurationValidator });
