import { I18nService } from 'nestjs-i18n';
import { Injectable } from '@nestjs/common';
import { MediaService } from '../service/media.service';
import { isPositive, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

/**
 * 画面宽度最大值校验器
 */
@Injectable()
@ValidatorConstraint({ async: false, name: 'MaxWidthValidator' })
export class MaxWidthValidator implements ValidatorConstraintInterface {
  constructor(
    private readonly i18n: I18nService,
    private readonly mediaService: MediaService,
  ) {}

  validate(value: string, validationArguments: ValidationArguments): Promise<boolean> | boolean {
    const maxWidth = validationArguments.constraints[0];

    if (!isPositive(maxWidth)) {
      return false;
    }

    try {
      const media = this.mediaService.readMedia(value);
      if (media.isAudioMedia()) {
        return false;
      }
      return media.getVideoStreams().every((videoStream) => videoStream.width <= maxWidth);
    } catch {
      return false;
    }
  }

  defaultMessage(validationArguments: ValidationArguments): string {
    return this.i18n.t('validation.MaxWidthValidator', {
      args: { property: validationArguments.property, constraints: validationArguments.constraints },
    });
  }
}
