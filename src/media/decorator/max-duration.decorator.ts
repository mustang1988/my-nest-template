import { registerDecorator, ValidationOptions } from 'class-validator';
import { MaxDurationValidator } from '../validator/max-duration.validator';

/**
 * 媒体时长最大值校验器装饰器
 * @param maxDurationInSecond 最小时长, 单位: 秒
 * @param options 校验选项
 */
export const MaxDuration = (maxDurationInSecond: number, options?: ValidationOptions) => (dto: object, propertyName: string) =>
  registerDecorator({ target: dto.constructor, propertyName, options, constraints: [maxDurationInSecond], validator: MaxDurationValidator });
