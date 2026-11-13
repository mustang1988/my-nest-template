import { MediaSizeValidator } from '../validator/media-size.validator';
import { registerDecorator, ValidationOptions } from 'class-validator';

/**
 * 媒体文件大小校验器装饰器
 *
 * @param minSize 最小文件大小; 数值按字节, 字符串按bytes库格式(如'10MB', '1.5GB')
 * @param maxSize 最大文件大小; 格式同minSize
 * @param options 校验选项
 */
export const MediaSize = (minSize: string | number, maxSize: string | number, options?: ValidationOptions) => (dto: object, propertyName: string) =>
  registerDecorator({
    target: dto.constructor,
    propertyName,
    options,
    constraints: [minSize, maxSize],
    validator: MediaSizeValidator,
  });
