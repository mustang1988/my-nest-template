import { ECodecType } from '../media.constant';
import { Duration } from './duration.decorator';
import { ValidationOptions } from 'class-validator';

/**
 * 媒体音频流时长范围校验器装饰器
 *
 * 适用于以下类型的媒体
 * - 图片
 * - 视频
 *
 * @param minDuration 最小时长, 单位: 秒
 * @param maxDuration 最大时长, 单位: 秒
 * @param streamIndex 指定校验的流索引(非ffprobe的全局流索引, 为音频流中的第N个); 指定时仅校验对应流的时长, 未指定时校验所有音频流的时长
 * @param options 校验选项
 * @example
 * ```typescript
 *
 * class TestDto {
 *   @AudioDuration(1.7, 4.9, 1) // media对应媒体的第二个音频流时长需在[1.7, 4.9]秒之间, 等价于 @Duration(1.7, 4.9, ECodecType.AUDIO, 1)
 *   @AudioDuration(1.6, 5) //      media对应媒体的所有音频流时长需在[1.6, 5]秒之间, 等价于 @Duration(1.6, 5, ECodecType.AUDIO)
 *   @IsString()
 *   @IsNotEmpty()
 *   media: string;
 * }
 * ```
 */
export const AudioDuration = (minDuration: number, maxDuration: number, streamIndex?: number, options?: ValidationOptions) =>
  Duration(minDuration, maxDuration, ECodecType.AUDIO, streamIndex, options);
