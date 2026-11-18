import { I18nService } from 'nestjs-i18n';
import { compact, isEmpty } from 'lodash';
import { Injectable } from '@nestjs/common';
import { ECodecType } from '../media.constant';
import { MediaService } from '../service/media.service';
import { MediaAudioStream } from '../implement/media-audio-stream.impl';
import { MediaVideoStream } from '../implement/media-video-stream.impl';
import { IMediaAudioStream } from '../interface/media-audio-stream.interface';
import { IMediaVideoStream } from '../interface/media-video-stream.interface';
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

/**
 * 媒体编码器类型校验器
 */
@Injectable()
@ValidatorConstraint({ async: true, name: 'IsCodecValidator' })
export class IsCodecValidator implements ValidatorConstraintInterface {
  constructor(
    private readonly i18n: I18nService,
    private readonly mediaService: MediaService,
  ) {}

  async validate(value: string, validationArguments: ValidationArguments): Promise<boolean> {
    try {
      /**
       * 期望的编码器名称或全名(单个或多个)
       */
      const expectCodecName = validationArguments.constraints[0] as string | Array<string>;

      /**
       * 归一化为编码器名称数组; 空数组不会匹配任何编码器, 校验必然失败
       */
      const expectCodecNames = Array.isArray(expectCodecName) ? expectCodecName : [expectCodecName];

      /**
       * 需要校验的流类型
       */
      const expectCodecType = validationArguments.constraints[1] as string;

      /**
       * 期望校验的流索引
       */
      const expectStreamIndex = validationArguments.constraints[2] as number | undefined;
      if (expectStreamIndex !== undefined && expectStreamIndex < 0) {
        return false;
      }

      const media = await this.mediaService.readMedia(value);
      /**
       * 待检查的流列表
       */
      let expectStreams: Array<IMediaAudioStream | IMediaVideoStream> = [];
      switch (expectCodecType) {
        case ECodecType.AUDIO.toString():
          expectStreams = expectStreamIndex !== undefined ? [media.getAudioStream(expectStreamIndex) as MediaAudioStream] : media.getAudioStreams();
          break;
        case ECodecType.VIDEO.toString():
          expectStreams = expectStreamIndex !== undefined ? [media.getVideoStream(expectStreamIndex) as MediaVideoStream] : media.getVideoStreams();
          break;
        default:
          return false;
      }
      expectStreams = compact(expectStreams); // 剔除待检查的流列表中可能存在的undefined
      return (
        !isEmpty(expectStreams) &&
        expectStreams.every((stream) => expectCodecNames.includes(stream.codec_name) || expectCodecNames.includes(stream.codec_long_name))
      );
    } catch {
      return false;
    }
  }

  defaultMessage(validationArguments: ValidationArguments): string {
    return this.i18n.t('validation.IsCodecValidator', { args: validationArguments });
  }
}
