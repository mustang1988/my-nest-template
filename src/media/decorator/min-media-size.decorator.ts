import { registerDecorator, ValidationOptions } from 'class-validator';
import { MinMediaSizeValidator } from '../validator/min-media-size.validator';

/**
 * 媒体文件大小最小值校验器装饰器
 *
 * @param minSize 最小文件大小; 数值按字节, 字符串按bytes库格式(如'10MB', '1.5GB')
 * @param options 校验选项
 */
export const MinMediaSize = (minSize: string | number, options?: ValidationOptions) => (dto: object, propertyName: string) =>
  registerDecorator({
    target: dto.constructor,
    propertyName,
    options,
    constraints: [minSize],
    validator: MinMediaSizeValidator,
  });
