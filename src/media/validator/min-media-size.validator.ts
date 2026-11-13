import { I18nService } from 'nestjs-i18n';
import { Injectable } from '@nestjs/common';
import { MediaService } from '../service/media.service';
import { ValidateMediaSizeUtil } from './util/validate-media-size.util';
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

/**
 * 媒体文件大小最小值校验器
 */
@Injectable()
@ValidatorConstraint({ async: true, name: 'MinMediaSizeValidator' })
export class MinMediaSizeValidator implements ValidatorConstraintInterface {
  constructor(
    private readonly i18n: I18nService,
    private readonly mediaService: MediaService,
  ) {}

  async validate(value: string, validationArguments: ValidationArguments): Promise<boolean> {
    const minSize = validationArguments.constraints[0] as string | number;
    const minSizeInBytes = ValidateMediaSizeUtil.parseConstraint(minSize);
    if (minSizeInBytes === undefined) {
      // 大小约束本身无法解析, 直接返回校验失败
      return false;
    }
    try {
      const media = await this.mediaService.readMedia(value);
      const size = ValidateMediaSizeUtil.getSize(media);
      if (size === undefined) {
        // 文件大小未知
        return false;
      }
      return size >= minSizeInBytes;
    } catch {
      return false;
    }
  }

  defaultMessage(validationArguments: ValidationArguments): string {
    return this.i18n.t('validation.MinMediaSizeValidator', {
      args: { property: validationArguments.property, constraints: validationArguments.constraints },
    });
  }
}
