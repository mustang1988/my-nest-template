import { registerDecorator, ValidationOptions } from 'class-validator';
import { MaxMediaSizeValidator } from '../validator/max-media-size.validator';

/**
 * 媒体文件大小最大值校验器装饰器
 *
 * @param maxSize 最大文件大小; 数值按字节, 字符串按bytes库格式(如'10MB', '1.5GB')
 * @param options 校验选项
 */
export const MaxMediaSize = (maxSize: string | number, options?: ValidationOptions) => (dto: object, propertyName: string) =>
  registerDecorator({
    target: dto.constructor,
    propertyName,
    options,
    constraints: [maxSize],
    validator: MaxMediaSizeValidator,
  });
