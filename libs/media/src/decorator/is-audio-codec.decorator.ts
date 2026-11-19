import { IsCodec } from './is-codec.decorator';
import { ValidationOptions } from 'class-validator';
import { ECodecType } from '../enum/codec-type.enum';

/**
 * 音频流编码器类型校验器装饰器
 * @param codecName 期望的编码器名称或全名, 支持提交单个名称或名称数组; 提交数组时被校验流的编码器名称或全名命中数组中任意一项均视为校验通过
 * @param streamIndex 期望检查的流索引, 为指定时检查所有流
 * @param options 校验选项
 */
export const AudioCodec = (codecName: string | Array<string>, streamIndex?: number, options?: ValidationOptions) =>
  IsCodec(codecName, ECodecType.AUDIO, streamIndex, options);
