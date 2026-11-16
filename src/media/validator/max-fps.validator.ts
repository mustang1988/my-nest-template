import { I18nService } from 'nestjs-i18n';
import { Injectable } from '@nestjs/common';
import { MediaService } from '../service/media.service';
import { ValidateFpsUtil } from './util/validate-fps.util';
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

/**
 * 媒体视频帧率最大值校验器
 */
@Injectable()
@ValidatorConstraint({ async: true, name: 'MaxFpsValidator' })
export class MaxFpsValidator implements ValidatorConstraintInterface {
  constructor(
    private readonly i18n: I18nService,
    private readonly mediaService: MediaService,
  ) {}

  async validate(value: string, validationArguments: ValidationArguments): Promise<boolean> {
    const [maxFps, streamIndex] = validationArguments.constraints as [number, number | undefined];
    try {
      const media = await this.mediaService.readMedia(value);
      const fpsList = ValidateFpsUtil.getFpsList(media, streamIndex);
      if (fpsList === undefined) {
        // 待校验的流不存在或帧率未知
        return false;
      }
      return fpsList.every((fps) => fps <= maxFps);
    } catch {
      return false;
    }
  }

  defaultMessage(validationArguments: ValidationArguments): string {
    return this.i18n.t('validation.MaxFpsValidator', {
      args: { property: validationArguments.property, constraints: validationArguments.constraints },
    });
  }
}
