import { ValidationOptions } from 'class-validator';
import { ECodecType } from '../enum/codec-type.enum';
import { MinDuration } from './min-duration.decorator';

/**
 * 媒体音频流时长最小值校验器装饰器
 *
 * 适用于以下类型的媒体
 * - 视频
 * - 音频
 *
 * @param minDuration 最小时长, 单位: 秒
 * @param streamIndex 指定校验的流索引(非ffprobe的全局流索引, 为音频流中的第N个); 指定时仅校验对应流的时长, 未指定时校验所有音频流的时长
 * @param options 校验选项
 * @example
 * ```typescript
 * class TestDto {
 *   @MinAudioDuration(1.7, 1) // media对应媒体的第二个音频流时长应不大于1.7秒, 等价于 @MinDuration(1.7, ECodecType.AUDIO, 1)
 *   @MinAudioDuration(1.6) //    media对应媒体的所有音频流时长应不大于1.6秒, 等价于 @MinDuration(1.6, ECodecType.AUDIO)
 *   @IsString()
 *   @IsNotEmpty()
 *   media: string;
 * }
 * ```
 */
export const MinAudioDuration = (minDuration: number, streamIndex?: number, options?: ValidationOptions) =>
  MinDuration(minDuration, ECodecType.AUDIO, streamIndex, options);
