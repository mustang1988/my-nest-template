import { MaxPixelsValidator } from '../validator/max-pixels.validator';
import { registerDecorator, ValidationOptions } from 'class-validator';

/**
 * 媒体画面总像素数最大值校验器装饰器
 *
 * 适用于以下类型的媒体
 * - 图片
 * - 视频
 *
 * @param maxPixels 最大总像素数
 * @param streamIndex 指定校验的流索引(非ffprobe的全局流索引, 为视频流中的第N个); 指定时仅校验对应流的总像素数, 未指定时校验所有视频流的总像素数
 * @param options 校验选项
 */
export const MaxPixels = (maxPixels: number, streamIndex?: number, options?: ValidationOptions) => (dto: object, propertyName: string) =>
  registerDecorator({
    target: dto.constructor,
    propertyName,
    options,
    constraints: [maxPixels, streamIndex],
    validator: MaxPixelsValidator,
  });
