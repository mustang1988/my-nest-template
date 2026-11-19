import { MinHeightValidator } from '../validator/min-height.validator';
import { registerDecorator, ValidationOptions } from 'class-validator';

/**
 * 画面高度最小值校验器装饰器
 *
 * 适用于以下类型的媒体
 * - 视频
 * - 图片
 *
 * @param minHeightInPixel 最小高度, 单位: px
 * @param streamIndex 指定校验的流索引(非ffprobe的全局流索引, 为视频流中的第N个); 指定时仅校验对应流的高度, 未指定时校验所有视频流的高度
 * @param options 校验选项
 * @example
 * ```typescript
 * class TestDto {
 *   @MinHeight(800, 0) //  media对应媒体的第一个视频流的高度应不小于800px
 *   @MinHeight(1000) //    media对应所有视频流的高度应不小于1000px
 *   @IsString()
 *   @IsNotEmpty()
 *   media: string;
 * }
 */
export const MinHeight = (minHeightInPixel: number, streamIndex?: number, options?: ValidationOptions) => (dto: object, propertyName: string) =>
  registerDecorator({ target: dto.constructor, propertyName, options, constraints: [minHeightInPixel, streamIndex], validator: MinHeightValidator });
