import { ECodecType } from '../enum/codec-type.enum';
import { IsCodecValidator } from '../validator/is-codec.validator';
import { registerDecorator, ValidationOptions } from 'class-validator';

/**
 * 媒体编码器类型校验器装饰器
 * @param codecName 期望的编码器名称或全名, 支持提交单个名称或名称数组; 提交数组时被校验流的编码器名称或全名命中数组中任意一项均视为校验通过
 * @param codecType 期望检查的流类型
 * @param streamIndex 期望检查的流索引, 为指定时检查所有流
 * @param options 校验选项
 */
export const IsCodec =
  (codecName: string | Array<string>, codecType: ECodecType, streamIndex?: number, options?: ValidationOptions) =>
  (dto: object, propertyName: string) =>
    registerDecorator({
      target: dto.constructor,
      propertyName,
      options,
      constraints: [codecName, codecType, streamIndex],
      validator: IsCodecValidator,
    });
