import { I18nService } from 'nestjs-i18n';
import { Injectable } from '@nestjs/common';
import { MediaService } from '../service/media.service';
import { ValidatePixelsUtil } from './util/validate-pixels.util';
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

/**
 * 媒体画面总像素数范围校验器
 *
 * 适用于以下类型的媒体
 * - 视频
 * - 图片
 */
@Injectable()
@ValidatorConstraint({ async: true, name: 'PixelsValidator' })
export class PixelsValidator implements ValidatorConstraintInterface {
  constructor(
    private readonly i18n: I18nService,
    private readonly mediaService: MediaService,
  ) {}

  async validate(value: string, validationArguments: ValidationArguments): Promise<boolean> {
    const [minPixels, maxPixels, streamIndex] = validationArguments.constraints as [number, number, number | undefined];
    try {
      const media = await this.mediaService.readMedia(value);
      const pixels = ValidatePixelsUtil.getPixels(media, streamIndex);
      if (pixels === undefined) {
        // 待校验的流不存在或画面宽高未知
        return false;
      }
      return pixels.every((pixel) => minPixels <= pixel && pixel <= maxPixels);
    } catch {
      return false;
    }
  }

  defaultMessage(validationArguments: ValidationArguments): string {
    return this.i18n.t('validation.PixelsValidator', {
      args: { property: validationArguments.property, constraints: validationArguments.constraints },
    });
  }
}
