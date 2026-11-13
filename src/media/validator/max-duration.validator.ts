import { I18nService } from 'nestjs-i18n';
import { Injectable } from '@nestjs/common';
import { MediaService } from '../service/media.service';
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

/**
 * 媒体时长最大值校验器
 */
@Injectable()
@ValidatorConstraint({ async: false, name: 'MaxDurationValidator' })
export class MaxDurationValidator implements ValidatorConstraintInterface {
  constructor(
    private readonly i18n: I18nService,
    private readonly mediaService: MediaService,
  ) {}

  validate(value: string, validationArguments: ValidationArguments): Promise<boolean> | boolean {
    const maxDuration: number = validationArguments.constraints[0];
    try {
      const media = this.mediaService.readMedia(value);
      if (media.isImageMedia()) {
        return false;
      }
      let duration: number = 0;
      if (media.isVideoMedia()) {
        duration = media.getVideoStream(0)?.duration as number;
      }
      if (media.isAudioMedia()) {
        duration = media.getAudioStream(0)?.duration as number;
      }
      return duration <= maxDuration;
    } catch {
      return false;
    }
  }

  defaultMessage(validationArguments: ValidationArguments): string {
    return this.i18n.t('validation.MaxDurationValidator', {
      args: { constraints: validationArguments.constraints, property: validationArguments.property },
    });
  }
}
