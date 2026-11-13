import { I18nService } from 'nestjs-i18n';
import { Injectable } from '@nestjs/common';
import { MediaService } from '../service/media.service';
import { isPositive, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

/**
 * 画面高度最大值校验器
 */
@Injectable()
@ValidatorConstraint({ async: false, name: 'MaxHeightValidator' })
export class MaxHeightValidator implements ValidatorConstraintInterface {
  constructor(
    private readonly i18n: I18nService,
    private readonly mediaService: MediaService,
  ) {}

  validate(value: string, validationArguments: ValidationArguments): Promise<boolean> | boolean {
    const maxHeight = validationArguments.constraints[0];

    if (!isPositive(maxHeight)) {
      return false;
    }

    try {
      const media = this.mediaService.readMedia(value);
      if (media.isAudioMedia()) {
        return false;
      }
      return media.getVideoStreams().every((videoStream) => videoStream.height <= maxHeight);
    } catch {
      return false;
    }
  }

  defaultMessage(validationArguments: ValidationArguments): string {
    return this.i18n.t('validation.MaxHeightValidator', {
      args: { property: validationArguments.property, constraints: validationArguments.constraints },
    });
  }
}
