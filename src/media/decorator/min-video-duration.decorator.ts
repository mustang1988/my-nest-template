import { ECodecType } from '../media.constant';
import { ValidationOptions } from 'class-validator';
import { MinDuration } from './min-duration.decorator';

/**
 * 媒体视频流时长最小值校验器装饰器
 *
 * 适用于以下类型的媒体
 * - 视频
 *
 * @param minDuration 最小时长, 单位: 秒
 * @param streamIndex 指定校验的流索引(非ffprobe的全局流索引, 为视频流中的第N个); 指定时仅校验对应流的时长, 未指定时校验所有视频流的时长
 * @param options 校验选项
 * @example
 * ```typescript
 *
 * class TestDto {
 *   @MinVideoDuration(2, 0) // media对应媒体的第一个时频流时长应不小于2秒, 等价于 @MinDuration(2, ECodecType.VIDEO, 0)
 *   @MinVideoDuration(1.5) //  media对应所有视频流时长应不小于1.5秒, 等价于 @MinDuration(1.5, ECodecType.VIDEO)
 *   @IsString()
 *   @IsNotEmpty()
 *   media: string;
 * }
 */
export const MinVideoDuration = (minDuration: number, streamIndex?: number, options?: ValidationOptions) =>
  MinDuration(minDuration, ECodecType.VIDEO, streamIndex, options);
