import { I18nService } from 'nestjs-i18n';
import { Injectable } from '@nestjs/common';
import { MediaService } from '../service/media.service';
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
    const [minDuration, maxDuration] = validationArguments.constraints as Array<number>;
    try {
      const media = await this.mediaService.readMedia(value);
      const duration = media.getDuration();
      if (duration === undefined) {
        // 图片媒体或时长未知
        return false;
      }
      return minDuration <= duration && duration <= maxDuration;
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
