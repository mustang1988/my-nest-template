import { MaxHeightValidator } from '../validator/max-height.validator';
import { registerDecorator, ValidationOptions } from 'class-validator';

/**
 * 画面高度最大值校验器装饰器
 *
 * 适用于以下类型的媒体
 * - 图片
 * - 视频
 *
 * @param maxHeightInPixel 最大高度, 单位: px
 * @param streamIndex 指定校验的流索引(非ffprobe的全局流索引, 为视频流中的第N个); 指定时仅校验对应流的高度, 未指定时校验所有视频流的高度
 * @param options 校验选项
 * @example
 * ```typescript
 *
 * class TestDto {
 *   @MaxHeight(1000, 0) // media对应媒体的第一个视频流的高度应不大于1000px
 *   @MaxHeight(1080) //    media对应所有视频流的高度应不大于1080px
 *   @IsString()
 *   @IsNotEmpty()
 *   media: string;
 * }
 */
export const MaxHeight = (maxHeightInPixel: number, streamIndex?: number, options?: ValidationOptions) => (dto: object, propertyName: string) =>
  registerDecorator({ target: dto.constructor, propertyName, options, constraints: [maxHeightInPixel, streamIndex], validator: MaxHeightValidator });
