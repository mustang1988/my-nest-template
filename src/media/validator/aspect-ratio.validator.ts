import { I18nService } from 'nestjs-i18n';
import { Injectable } from '@nestjs/common';
import { MediaService } from '../service/media.service';
import { ValidateAspectRatioUtil } from './util/validate-aspect-ratio.util';
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

/**
 * 媒体画面宽高比范围校验器
 */
@Injectable()
@ValidatorConstraint({ async: true, name: 'AspectRatioValidator' })
export class AspectRatioValidator implements ValidatorConstraintInterface {
  constructor(
    private readonly i18n: I18nService,
    private readonly mediaService: MediaService,
  ) {}

  async validate(value: string, validationArguments: ValidationArguments): Promise<boolean> {
    const [minAspectRatio, maxAspectRatio, streamIndex] = validationArguments.constraints as [number, number, number | undefined];
    try {
      const media = await this.mediaService.readMedia(value);
      const ratios = ValidateAspectRatioUtil.getRatios(media, streamIndex);
      if (ratios === undefined) {
        // 待校验的流不存在或画面宽高未知
        return false;
      }
      return ratios.every((ratio) => minAspectRatio <= ratio && ratio <= maxAspectRatio);
    } catch {
      return false;
    }
  }

  defaultMessage(validationArguments: ValidationArguments): string {
    return this.i18n.t('validation.AspectRatioValidator', {
      args: { property: validationArguments.property, constraints: validationArguments.constraints },
    });
  }
}
