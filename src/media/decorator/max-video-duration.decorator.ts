import { ECodecType } from '../media.constant';
import { ValidationOptions } from 'class-validator';
import { MaxDuration } from './max-duration.decorator';

/**
 * 媒体视频流时长最大值校验器装饰器
 *
 * 适用于以下类型的媒体
 * - 视频
 *
 * @param maxDuration 最大时长, 单位: 秒
 * @param streamIndex 指定校验的流索引(非ffprobe的全局流索引, 为视频流中的第N个); 指定时仅校验对应流的时长, 未指定时校验所有视频流的时长
 * @param options 校验选项
 * @example
 * ```typescript
 * class TestDto {
 *   @MinVideoDuration(8, 0) // media对应媒体的第一个时频流时长应不大于8秒, 等价于 @MaxDuration(8, ECodecType.VIDEO, 0)
 *   @MinVideoDuration(10) //  media对应所有视频流时长应不大于10秒, 等价于 @MaxDuration(10, ECodecType.VIDEO)
 *   @IsString()
 *   @IsNotEmpty()
 *   media: string;
 * }
 */
export const MaxVideoDuration = (maxDuration: number, streamIndex?: number, options?: ValidationOptions) =>
  MaxDuration(maxDuration, ECodecType.VIDEO, streamIndex, options);
