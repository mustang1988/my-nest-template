import { I18nService } from 'nestjs-i18n';
import { compact, isEmpty } from 'lodash';
import { Injectable } from '@nestjs/common';
import { ECodecType } from '../media.constant';
import { MediaService } from '../service/media.service';
import { MediaAudioStream } from '../implement/media-audio-stream.impl';
import { MediaVideoStream } from '../implement/media-video-stream.impl';
import { IMediaAudioStream } from '../interface/media-audio-stream.interface';
import { IMediaVideoStream } from '../interface/media-video-stream.interface';
import { min, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

/**
 * 媒体编码器类型校验器
 */
@Injectable()
@ValidatorConstraint({ async: false, name: 'IsCodecValidator' })
export class IsCodecValidator implements ValidatorConstraintInterface {
  constructor(
    private readonly i18n: I18nService,
    private readonly mediaService: MediaService,
  ) {}

  validate(value: string, validationArguments: ValidationArguments): Promise<boolean> | boolean {
    try {
      /**
       * 期望的编码器名称或全名
       */
      const expectCodecName = validationArguments.constraints[0] as string;

      /**
       * 需要校验的流类型
       */
      const expectCodecType = validationArguments.constraints[1] as string;

      /**
       * 期望校验的流索引
       */
      const expectStreamIndex = validationArguments.constraints[2] as number;
      if (expectStreamIndex && expectStreamIndex < 0) {
        // 期望的流索引不可以小于0, 否则直接返回校验失败
        return false;
      }

      const media = this.mediaService.readMedia(value);
      /**
       * 待检查的流列表
       */
      let expectStreams: Array<IMediaAudioStream | IMediaVideoStream> = [];
      switch (expectCodecType) {
        case ECodecType.AUDIO.toString():
          expectStreams = expectStreamIndex ? [media.getAudioStream(expectStreamIndex) as MediaAudioStream] : media.getAudioStreams();
          break;
        case ECodecType.VIDEO.toString():
          expectStreams = expectStreamIndex ? [media.getVideoStream(expectStreamIndex) as MediaVideoStream] : media.getVideoStreams();
          break;
        default:
          return false;
      }
      expectStreams = compact(expectStreams); // 剔除待检查的流列表中可能存在的undefined
      return (
        !isEmpty(expectStreams) &&
        expectStreams.every((stream) => stream.codec_name === expectCodecName || stream.codec_long_name === expectCodecName)
      );
    } catch {
      return false;
    }
  }

  defaultMessage(validationArguments: ValidationArguments): string {
    return this.i18n.t('validation.IsCodecValidator', {
      args: { property: validationArguments.property, constraints: validationArguments.constraints },
    });
  }
}
