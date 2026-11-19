import { Type } from 'class-transformer';
import { i18nValidationMessage } from 'nestjs-i18n';
import { IsIn, IsInt, IsNotEmpty, IsOptional, IsString, IsUrl, Length } from 'class-validator';
import { AspectRatio, AudioCodec, AudioDuration, Fps, IsVideo, MaxHeight, MinWidth, VideoCodec, VideoDuration } from '@pgu/media';

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

  /**
   * 示例媒体
   *
   * - 可选
   * - URL
   * - 视频媒体
   * - 视频编码器h264或hevc
   * - 视频时长[0,10]秒
   * - 音频编码器aac
   * - 音频时长[10, 60]秒
   * - 画面宽度>=1920px
   * - 画面高度<=1080px
   * - 画面宽高比[1, 2.5]
   * - 画面帧率[30, 60]
   */
  @Fps(60, 120)
  @AspectRatio(1, 2.5)
  @MaxHeight(1080)
  @MinWidth(1920)
  @AudioDuration(10, 60)
  @AudioCodec('aac')
  @VideoDuration(0, 5)
  @VideoCodec(['h264', 'hevc'])
  @IsVideo()
  @IsUrl()
  @IsOptional()
  sample_media?: string;
}
