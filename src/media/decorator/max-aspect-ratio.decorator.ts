import { registerDecorator, ValidationOptions } from 'class-validator';
import { MaxAspectRatioValidator } from '../validator/max-aspect-ratio.validator';

/**
 * 媒体画面宽高比最大值校验器装饰器
 *
 * 适用于以下类型的媒体
 * - 图片
 * - 视频
 *
 * @param maxAspectRatio 最大宽高比
 * @param streamIndex 指定校验的流索引(非ffprobe的全局流索引, 为视频流中的第N个); 指定时仅校验对应流的宽高比, 未指定时校验所有视频流的宽高比
 * @param options 校验选项
 * @example
 * ```typescript
 *
 * class TestDto {
 *   @MaxAspectRatio(1.75, 0) // media对应媒体的第一个视频流的宽高比应不大于1.75
 *   @MaxAspectRatio(2.0) //     media对应媒体所有视频流的宽高比应不大于2.0
 *   @IsString()
 *   @IsNotEmpty()
 *   media: string;
 * }
 * ```
 */
export const MaxAspectRatio = (maxAspectRatio: number, streamIndex?: number, options?: ValidationOptions) => (dto: object, propertyName: string) =>
  registerDecorator({
    target: dto.constructor,
    propertyName,
    options,
    constraints: [maxAspectRatio, streamIndex],
    validator: MaxAspectRatioValidator,
  });
