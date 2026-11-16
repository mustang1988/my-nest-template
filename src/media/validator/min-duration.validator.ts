import { I18nService } from 'nestjs-i18n';
import { Injectable } from '@nestjs/common';
import { ECodecType } from '../media.constant';
import { MediaService } from '../service/media.service';
import { ValidateDurationUtil } from './util/validate-duration.util';
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

/**
 * 媒体时长最小值校验器
 */
@Injectable()
@ValidatorConstraint({ async: true, name: 'MinDurationValidator' })
export class MinDurationValidator implements ValidatorConstraintInterface {
  constructor(
    private readonly i18n: I18nService,
    private readonly mediaService: MediaService,
  ) {}

  async validate(value: string, validationArguments: ValidationArguments): Promise<boolean> {
    const [minDuration, codecType, streamIndex] = validationArguments.constraints as [number, ECodecType | undefined, number | undefined];
    try {
      const media = await this.mediaService.readMedia(value);
      const durations = ValidateDurationUtil.getDurations(media, codecType, streamIndex);
      if (durations === undefined) {
        // 待校验的流不存在或时长未知
        return false;
      }
      return durations.every((duration) => duration >= minDuration);
    } catch {
      return false;
    }
  }

  defaultMessage(validationArguments: ValidationArguments): string {
    return this.i18n.t('validation.MinDurationValidator', {
      args: { constraints: validationArguments.constraints, property: validationArguments.property },
    });
  }
}
