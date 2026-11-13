import { I18nService } from 'nestjs-i18n';
import { Injectable } from '@nestjs/common';
import { MediaService } from '../service/media.service';
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

/**
 * 媒体时长范围校验器
 */
@Injectable()
@ValidatorConstraint({ async: false, name: 'DurationValidator' })
export class DurationValidator implements ValidatorConstraintInterface {
  constructor(
    private readonly i18n: I18nService,
    private readonly mediaService: MediaService,
  ) {}

  validate(value: any, validationArguments: ValidationArguments): Promise<boolean> | boolean {
    const [minDuration, maxDuration] = validationArguments.constraints as Array<number>;
    try {
      const media = this.mediaService.readMedia(value);
      if (media.isImageMedia()) {
        return false;
      }
      let duration: number = media.format?.duration ?? 0;
      if (media.isVideoMedia()) {
        const videoDuration = media.getVideoStream(0)?.duration as number;
        duration = !isNaN(videoDuration) ? (media.getVideoStream(0)?.duration as number) : duration;
      }
      if (media.isAudioMedia()) {
        const audioDuration = media.getAudioStream(0)?.duration as number;
        duration = !isNaN(audioDuration) ? (media.getAudioStream(0)?.duration as number) : duration;
      }
      return !isNaN(duration) && minDuration <= duration && duration <= maxDuration;
    } catch {
      return false;
    }
  }

  defaultMessage(validationArguments: ValidationArguments): string {
    return this.i18n.t('validation.DurationValidator', {
      args: { property: validationArguments.property, constraints: validationArguments.constraints },
    });
  }
}
