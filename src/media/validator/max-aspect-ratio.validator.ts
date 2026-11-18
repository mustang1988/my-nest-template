import { I18nService } from 'nestjs-i18n';
import { Injectable } from '@nestjs/common';
import { MediaService } from '../service/media.service';
import { ValidateAspectRatioUtil } from './util/validate-aspect-ratio.util';
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

/**
 * 媒体画面宽高比最大值校验器
 *
 * 适用于以下类型的媒体
 * - 图片
 * - 视频
 */
@Injectable()
@ValidatorConstraint({ async: true, name: 'MaxAspectRatioValidator' })
export class MaxAspectRatioValidator implements ValidatorConstraintInterface {
  constructor(
    private readonly i18n: I18nService,
    private readonly mediaService: MediaService,
  ) {}

  async validate(value: string, validationArguments: ValidationArguments): Promise<boolean> {
    const [maxAspectRatio, streamIndex] = validationArguments.constraints as [number, number | undefined];
    try {
      const media = await this.mediaService.readMedia(value);
      const ratios = ValidateAspectRatioUtil.getAspectRatios(media, streamIndex);
      if (ratios === undefined) {
        return false;
      }
      return ratios.every((ratio) => ratio <= maxAspectRatio);
    } catch {
      return false;
    }
  }

  defaultMessage(validationArguments: ValidationArguments): string {
    return this.i18n.t('validation.MaxAspectRatioValidator', {
      args: { property: validationArguments.property, constraints: validationArguments.constraints },
    });
  }
}
