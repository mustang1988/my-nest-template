import { ValidationOptions } from 'class-validator';
import { ECodecType } from '../enum/codec-type.enum';
import { MaxDuration } from './max-duration.decorator';

/**
 * 媒体音频流时长最大值校验器装饰器
 *
 * 适用于以下类型的媒体
 * - 视频
 * - 音频
 *
 * @param maxDuration 最大时长, 单位: 秒
 * @param streamIndex 指定校验的流索引(非ffprobe的全局流索引, 为音频流中的第N个); 指定时仅校验对应流的时长, 未指定时校验所有音频流的时长
 * @param options 校验选项
 * @example
 * ```typescript
 * class TestDto {
 *   @MaxAudioDuration(2, 0) // media对应媒体的第一个音频流时长应不大于2秒, 等价于 @MaxDuration(2, ECodecType.AUDIO, 0)
 *   @MaxAudioDuration(1.5) //  media对应所有音频流时长应不大于1.5秒, 等价于 @MaxDuration(1.5, ECodecType.AUDIO)
 *   @IsString()
 *   @IsNotEmpty()
 *   media: string;
 * }
 */
export const MaxAudioDuration = (maxDuration: number, streamIndex?: number, options?: ValidationOptions) =>
  MaxDuration(maxDuration, ECodecType.AUDIO, streamIndex, options);
