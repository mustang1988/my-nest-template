import { ECodecType } from '../media.constant';
import { registerDecorator, ValidationOptions } from 'class-validator';
import { MaxDurationValidator } from '../validator/max-duration.validator';

/**
 * 媒体时长最大值校验器装饰器
 * @param maxDurationInSecond 最大时长, 单位: 秒
 * @param codecType 指定校验的流类型; 指定时按对应流的流级时长校验, 未指定时按媒体整体时长校验
 * @param streamIndex 指定校验的流索引(非ffprobe的全局流索引, 为该类型流中的第N个); 指定时仅校验对应流的时长, 未指定时校验该类型所有流的时长
 * @param options 校验选项
 */
export const MaxDuration =
  (maxDurationInSecond: number, codecType?: ECodecType, streamIndex?: number, options?: ValidationOptions) =>
  (dto: object, propertyName: string) =>
    registerDecorator({
      target: dto.constructor,
      propertyName,
      options,
      constraints: [maxDurationInSecond, codecType, streamIndex],
      validator: MaxDurationValidator,
    });
