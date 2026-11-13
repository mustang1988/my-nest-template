import { FpsValidator } from '../validator/fps.validator';
import { registerDecorator, ValidationOptions } from 'class-validator';

/**
 * 媒体视频帧率校验器装饰器
 *
 * 适用于以下类型媒体
 * - 视频
 *
 * @param minFps 最小帧率, 单位: 帧/秒
 * @param maxFps 最大帧率, 单位: 帧/秒
 * @param streamIndex 指定校验的流索引(非ffprobe的全局流索引, 为视频流中的第N个); 指定时仅校验对应流的帧率, 未指定时校验所有视频流的帧率
 * @param options 校验选项
 */
export const Fps = (minFps: number, maxFps: number, streamIndex?: number, options?: ValidationOptions) => (dto: object, propertyName: string) =>
  registerDecorator({
    target: dto.constructor,
    propertyName,
    options,
    constraints: [minFps, maxFps, streamIndex],
    validator: FpsValidator,
  });
