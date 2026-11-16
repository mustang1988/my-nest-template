import { I18nService } from 'nestjs-i18n';
import { Injectable } from '@nestjs/common';
import { MediaService } from '../service/media.service';
import { isPositive, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

/**
 * 画面宽度范围校验器
 */
@Injectable()
@ValidatorConstraint({ async: true, name: 'WidthValidator' })
export class WidthValidator implements ValidatorConstraintInterface {
  constructor(
    private readonly i18n: I18nService,
    private readonly mediaService: MediaService,
  ) {}

  async validate(value: string, validationArguments: ValidationArguments): Promise<boolean> {
    const minWidth = validationArguments.constraints[0];
    const maxWidth = validationArguments.constraints[1];

    if (!isPositive(minWidth) || !isPositive(maxWidth)) {
      return false;
    }

    try {
      const media = await this.mediaService.readMedia(value);
      if (media.isAudioMedia()) {
        return false;
      }
      return media.getVideoStreams().every((videoStream) => minWidth <= videoStream.width && videoStream.width <= maxWidth);
    } catch {
      return false;
    }
  }

  defaultMessage(validationArguments: ValidationArguments): string {
    return this.i18n.t('validation.WidthValidator', {
      args: { property: validationArguments.property, constraints: validationArguments.constraints },
    });
  }
}
