import { MinWidthValidator } from '../validator/min-width.validator';
import { registerDecorator, ValidationOptions } from 'class-validator';

/**
 * 画面宽度最小值校验器装饰器
 *
 * 适用于以下类型的媒体
 * - 视频
 * - 图片
 *
 * @param minWidthInPixel 最小宽度, 单位: px
 * @param streamIndex 指定校验的流索引(非ffprobe的全局流索引, 为视频流中的第N个); 指定时仅校验对应流的宽度, 未指定时校验所有视频流的宽度
 * @param options 校验选项
 * @example
 * ```typescript
 *
 * class TestDto {
 *   @MinWidth(1000, 0) // media对应媒体的第一个视频流的宽度应不小于1000px
 *   @MinWidth(1080) //    media对应所有视频流的宽度应不小于1080px
 *   @IsString()
 *   @IsNotEmpty()
 *   media: string;
 * }
 */
export const MinWidth = (minWidthInPixel: number, streamIndex?: number, options?: ValidationOptions) => (dto: object, propertyName: string) =>
  registerDecorator({ target: dto.constructor, propertyName, options, constraints: [minWidthInPixel, streamIndex], validator: MinWidthValidator });
