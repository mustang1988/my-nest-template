import { I18nService } from 'nestjs-i18n';
import { Injectable } from '@nestjs/common';
import { MediaService } from '../service/media.service';
import { ValidatePixelsUtil } from './util/validate-pixels.util';
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

/**
 * 媒体画面总像素数最小值校验器
 *
 * 适用于以下类型的媒体
 * - 视频
 * - 图片
 */
@Injectable()
@ValidatorConstraint({ async: true, name: 'MinPixelsValidator' })
export class MinPixelsValidator implements ValidatorConstraintInterface {
  constructor(
    private readonly i18n: I18nService,
    private readonly mediaService: MediaService,
  ) {}

  async validate(value: string, validationArguments: ValidationArguments): Promise<boolean> {
    const [minPixels, streamIndex] = validationArguments.constraints as [number, number | undefined];
    try {
      const media = await this.mediaService.readMedia(value);
      const pixels = ValidatePixelsUtil.getPixels(media, streamIndex);
      if (pixels === undefined) {
        return false;
      }
      return pixels.every((pixel) => pixel >= minPixels);
    } catch {
      return false;
    }
  }

  defaultMessage(validationArguments: ValidationArguments): string {
    return this.i18n.t('validation.MinPixelsValidator', { args: validationArguments });
  }
}
