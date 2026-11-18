import { I18nService } from 'nestjs-i18n';
import { Injectable } from '@nestjs/common';
import { MediaService } from '../service/media.service';
import { ValidateDimensionUtil } from './util/validate-dimension.util';
import { isPositive, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

/**
 * 画面高度最大值校验器
 *
 * 适用于以下类型的媒体
 * - 视频
 * - 图片
 */
@Injectable()
@ValidatorConstraint({ async: true, name: 'MaxHeightValidator' })
export class MaxHeightValidator implements ValidatorConstraintInterface {
  constructor(
    private readonly i18n: I18nService,
    private readonly mediaService: MediaService,
  ) {}

  async validate(value: string, validationArguments: ValidationArguments): Promise<boolean> {
    const [maxHeight, streamIndex] = validationArguments.constraints as [number, number | undefined];

    if (!isPositive(maxHeight)) {
      return false;
    }

    try {
      const media = await this.mediaService.readMedia(value);
      const dimensions = ValidateDimensionUtil.getDimensions(media, streamIndex);
      if (dimensions === undefined) {
        return false;
      }
      return dimensions.every((dimension) => dimension.height <= maxHeight);
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
