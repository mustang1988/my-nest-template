import { registerDecorator, ValidationOptions } from 'class-validator';
import { MinAspectRatioValidator } from '../validator/min-aspect-ratio.validator';

/**
 * 媒体画面宽高比最小值校验器装饰器
 *
 * 适用于以下媒体
 * - 图片
 * - 视频
 *
 * @param minAspectRatio 最小宽高比
 * @param streamIndex 指定校验的流索引(非ffprobe的全局流索引, 为视频流中的第N个); 指定时仅校验对应流的宽高比, 未指定时校验所有视频流的宽高比
 * @param options 校验选项
 */
export const MinAspectRatio = (minAspectRatio: number, streamIndex?: number, options?: ValidationOptions) => (dto: object, propertyName: string) =>
  registerDecorator({
    target: dto.constructor,
    propertyName,
    options,
    constraints: [minAspectRatio, streamIndex],
    validator: MinAspectRatioValidator,
  });
