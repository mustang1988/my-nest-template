import { I18nService } from 'nestjs-i18n';
import { Injectable } from '@nestjs/common';
import { MediaService } from '../service/media.service';
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

/**
 * 属性值对应媒体是否为图片媒体校验器
 */
@Injectable()
@ValidatorConstraint({ async: false, name: 'IsImageValidator' })
export class IsImageValidator implements ValidatorConstraintInterface {
  constructor(
    private readonly i18n: I18nService,
    private readonly mediaService: MediaService,
  ) {}

  validate(value: string): Promise<boolean> | boolean {
    try {
      const media = this.mediaService.readMedia(value);
      return media.isImageMedia();
    } catch {
      return false;
    }
  }

  defaultMessage(validationArguments: ValidationArguments): string {
    return this.i18n.t('validator.IsImageValidator', { args: { property: validationArguments.property } });
  }
}
