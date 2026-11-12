import { I18nService } from 'nestjs-i18n';
import { Injectable } from '@nestjs/common';
import { MediaService } from '../service/media.service';
import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({
  async: false,
  name: 'IsVideoFileValidator',
})
@Injectable()
export class IsVideoFileValidator implements ValidatorConstraintInterface {
  constructor(
    private readonly i18n: I18nService,
    private readonly mediaService: MediaService,
  ) {}

  validate(value: string): Promise<boolean> | boolean {
    const media = this.mediaService.readMediaByFilepath(value);
    const hasVideoStream = media.getVideoStreams().length > 0;
    const IMAGE_DEMUXER = ['png_pipe', 'jpeg_pipe', 'webp_pipe', 'image2', 'gif'];
    const isImage = IMAGE_DEMUXER.includes(media.format?.format_name as string);
    return !isImage && hasVideoStream;
  }

  defaultMessage(): string {
    return this.i18n.t('validator.IsVideoFileValidator', { args: {} });
  }
}
