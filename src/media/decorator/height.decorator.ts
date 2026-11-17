import { HeightValidator } from '../validator/height.validator';
import { registerDecorator, ValidationOptions } from 'class-validator';

/**
 * 画面高度范围校验器装饰器
 *
 * 适用于以下类型的媒体
 * - 图片
 * - 视频
 *
 * @param minHeightInPixel 最小高度, 单位: px
 * @param maxHeightInPixel 最大高度, 单位: px
 * @param streamIndex 指定校验的流索引(非ffprobe的全局流索引, 为视频流中的第N个); 指定时仅校验对应流的高度, 未指定时校验所有视频流的高度
 * @param options 校验选项
 * @example
 * ```typescript
 *
 * class TestDto {
 *   @Height(600, 1000, 0) // media对应媒体的第一个视频流的高度需在[600, 1000]px之间
 *   @Height(500, 1080) //    media对应所有视频流的高度需在[500, 1080]px之间
 *   @IsString()
 *   @IsNotEmpty()
 *   media: string;
 * }
 * ```
 */
export const Height =
  (minHeightInPixel: number, maxHeightInPixel: number, streamIndex?: number, options?: ValidationOptions) => (dto: object, propertyName: string) =>
    registerDecorator({
      target: dto.constructor,
      propertyName,
      options,
      constraints: [minHeightInPixel, maxHeightInPixel, streamIndex],
      validator: HeightValidator,
    });
