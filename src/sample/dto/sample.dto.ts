import { Type } from 'class-transformer';
import { i18nValidationMessage } from 'nestjs-i18n';
import { ECodecType } from 'src/media/media.constant';
import { IsCodec } from 'src/media/decorator/is-codec.decorator';
import { IsVideo } from 'src/media/decorator/is-video.decorator';
import { MinWidth } from 'src/media/decorator/min-width.decorator';
import { MinHeight } from 'src/media/decorator/min-height.decorator';
import { VideoDuration } from 'src/media/decorator/video-duration.decorator';
import { IsIn, IsInt, IsNotEmpty, IsOptional, IsString, IsUrl, Length } from 'class-validator';

export class SampleQueryDto {
  @Length(1, 20, { message: i18nValidationMessage('validation.Length') })
  @IsString({ message: i18nValidationMessage('validation.IsString') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.IsNotEmpty') })
  sample_foo: string;

  @IsIn([0, 1, 2, 3], { message: i18nValidationMessage('validation.IsIn') })
  @IsInt({ message: i18nValidationMessage('validation.IsInt') })
  @Type(() => Number)
  @IsOptional()
  sample_bar: number;
}

export class SampleCreateDto {
  @Length(1, 100, { message: i18nValidationMessage('validation.Length') })
  @IsString({ message: i18nValidationMessage('validation.IsString') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.IsNotEmpty') })
  sample_name: string;

  @MinHeight(1080)
  @MinWidth(1920)
  @IsCodec(['aac'], ECodecType.AUDIO)
  @VideoDuration(0, 10)
  @IsCodec(['h264', 'hevc'], ECodecType.VIDEO)
  @IsVideo()
  @IsUrl()
  @IsOptional()
  sample_media?: string;
}
