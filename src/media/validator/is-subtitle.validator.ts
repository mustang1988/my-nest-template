import { I18nService } from 'nestjs-i18n';
import { Injectable } from '@nestjs/common';
import { MediaService } from '../service/media.service';
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

/**
 * 属性值对应媒体是否为字幕媒体校验器
 */
@Injectable()
@ValidatorConstraint({ async: true, name: 'IsSubtitleValidator' })
export class IsSubtitleValidator implements ValidatorConstraintInterface {
  constructor(
    private readonly i18n: I18nService,
    private readonly mediaService: MediaService,
  ) {}

  async validate(value: string): Promise<boolean> {
    try {
      const media = await this.mediaService.readMedia(value);
      return media.isSubtitleMedia();
    } catch {
      return false;
    }
  }

  defaultMessage(validationArguments: ValidationArguments): string {
    return this.i18n.t('validation.IsSubtitleValidator', {
      args: { property: validationArguments.property, constraints: validationArguments.constraints },
    });
  }
}
