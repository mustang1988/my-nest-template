import { ECodecType } from '../media.constant';
import { Duration } from './duration.decorator';
import { ValidationOptions } from 'class-validator';

/**
 * 媒体视频流时长范围校验器装饰器
 *
 * 适用于以下类型的媒体
 * - 视频
 *
 * @param minDuration 最小时长, 单位: 秒
 * @param maxDuration 最大时长, 单位: 秒
 * @param streamIndex 指定校验的流索引(非ffprobe的全局流索引, 为视频流中的第N个); 指定时仅校验对应流的时长, 未指定时校验所有视频流的时长
 * @param options 校验选项
 * @example
 * ```typescript
 *
 * class TestDto {
 *   @VideoDuration(2, 5, 0) // media对应媒体的第一个时频流时长应在[2,5]秒范围内, 等价于 @Duration(2, 5, ECodecType.VIDEO, 0)
 *   @VideoDuration(1.5, 6) //  media对应所有视频流时长应在[1.5, 6]秒范围内, 等价于 @Duration(1.5, 6, ECodecType.VIDEO)
 *   @IsString()
 *   @IsNotEmpty()
 *   media: string;
 * }
 */
export const VideoDuration = (minDuration: number, maxDuration: number, streamIndex?: number, options?: ValidationOptions) =>
  Duration(minDuration, maxDuration, ECodecType.VIDEO, streamIndex, options);
