import { MinFpsValidator } from '../validator/min-fps.validator';
import { registerDecorator, ValidationOptions } from 'class-validator';

/**
 * 媒体视频帧率最小值校验器装饰器
 *
 * 适用于以下类型媒体
 * - 视频
 *
 * @param minFps 最小帧率, 单位: 帧/秒
 * @param streamIndex 指定校验的流索引(非ffprobe的全局流索引, 为视频流中的第N个); 指定时仅校验对应流的帧率, 未指定时校验所有视频流的帧率
 * @param options 校验选项
 */
export const MinFps = (minFps: number, streamIndex?: number, options?: ValidationOptions) => (dto: object, propertyName: string) =>
  registerDecorator({
    target: dto.constructor,
    propertyName,
    options,
    constraints: [minFps, streamIndex],
    validator: MinFpsValidator,
  });
