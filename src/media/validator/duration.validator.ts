import { I18nService } from 'nestjs-i18n';
import { Injectable } from '@nestjs/common';
import { ECodecType } from '../media.constant';
import { MediaService } from '../service/media.service';
import { ValidateDurationUtil } from './util/validate-duration.util';
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

/**
 * 媒体时长范围校验器
 */
@Injectable()
@ValidatorConstraint({ async: true, name: 'DurationValidator' })
export class DurationValidator implements ValidatorConstraintInterface {
  constructor(
    private readonly i18n: I18nService,
    private readonly mediaService: MediaService,
  ) {}

  async validate(value: string, validationArguments: ValidationArguments): Promise<boolean> {
    const [minDuration, maxDuration, codecType, streamIndex] = validationArguments.constraints as [
      number,
      number,
      ECodecType | undefined,
      number | undefined,
    ];
    try {
      const media = await this.mediaService.readMedia(value);
      const durations = ValidateDurationUtil.getDurations(media, codecType, streamIndex);
      if (durations === undefined) {
        // 待校验的流不存在或时长未知
        return false;
      }
      return durations.every((duration) => minDuration <= duration && duration <= maxDuration);
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
