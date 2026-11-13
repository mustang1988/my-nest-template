import { I18nService } from 'nestjs-i18n';
import { Injectable } from '@nestjs/common';
import { MediaService } from '../service/media.service';
import { isPositive, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

/**
 * 画面高度范围校验器
 */
@Injectable()
@ValidatorConstraint({ async: true, name: 'HeightValidator' })
export class HeightValidator implements ValidatorConstraintInterface {
  constructor(
    private readonly i18n: I18nService,
    private readonly mediaService: MediaService,
  ) {}

  async validate(value: string, validationArguments: ValidationArguments): Promise<boolean> {
    const minHeight = validationArguments.constraints[0];
    const maxHeight = validationArguments.constraints[1];

    if (!isPositive(minHeight) || !isPositive(maxHeight)) {
      return false;
    }

    try {
      const media = await this.mediaService.readMedia(value);
      if (media.isAudioMedia()) {
        return false;
      }
      return media.getVideoStreams().every((videoStream) => minHeight <= videoStream.height && videoStream.height <= maxHeight);
    } catch {
      return false;
    }
  }

  defaultMessage(validationArguments: ValidationArguments): string {
    return this.i18n.t('validation.HeightValidator', {
      args: { property: validationArguments.property, constraints: validationArguments.constraints },
    });
  }
}
