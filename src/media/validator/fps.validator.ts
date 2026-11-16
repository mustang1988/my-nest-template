import { I18nService } from 'nestjs-i18n';
import { Injectable } from '@nestjs/common';
import { MediaService } from '../service/media.service';
import { ValidateFpsUtil } from './util/validate-fps.util';
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

/**
 * 媒体视频帧率范围校验器
 */
@Injectable()
@ValidatorConstraint({ async: true, name: 'FpsValidator' })
export class FpsValidator implements ValidatorConstraintInterface {
  constructor(
    private readonly i18n: I18nService,
    private readonly mediaService: MediaService,
  ) {}

  async validate(value: string, validationArguments: ValidationArguments): Promise<boolean> {
    const [minFps, maxFps, streamIndex] = validationArguments.constraints as [number, number, number | undefined];
    try {
      const media = await this.mediaService.readMedia(value);
      const fpsList = ValidateFpsUtil.getFpsList(media, streamIndex);
      if (fpsList === undefined) {
        // 待校验的流不存在或帧率未知
        return false;
      }
      return fpsList.every((fps) => minFps <= fps && fps <= maxFps);
    } catch {
      return false;
    }
  }

  defaultMessage(validationArguments: ValidationArguments): string {
    return this.i18n.t('validation.FpsValidator', {
      args: { property: validationArguments.property, constraints: validationArguments.constraints },
    });
  }
}
