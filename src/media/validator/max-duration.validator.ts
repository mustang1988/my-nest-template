import { I18nService } from 'nestjs-i18n';
import { Injectable } from '@nestjs/common';
import { MediaService } from '../service/media.service';
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

/**
 * 媒体时长最大值校验器
 */
@Injectable()
@ValidatorConstraint({ async: true, name: 'MaxDurationValidator' })
export class MaxDurationValidator implements ValidatorConstraintInterface {
  constructor(
    private readonly i18n: I18nService,
    private readonly mediaService: MediaService,
  ) {}

  async validate(value: string, validationArguments: ValidationArguments): Promise<boolean> {
    const maxDuration: number = validationArguments.constraints[0];
    try {
      const media = await this.mediaService.readMedia(value);
      const duration = media.getDuration();
      if (duration === undefined) {
        // 图片媒体或时长未知
        return false;
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
