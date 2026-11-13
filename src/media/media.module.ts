import { MediaService } from './service/media.service';
import { FpsValidator } from './validator/fps.validator';
import { Global, Module, Provider } from '@nestjs/common';
import { WidthValidator } from './validator/width.validator';
import { HeightValidator } from './validator/height.validator';
import { MaxFpsValidator } from './validator/max-fps.validator';
import { MinFpsValidator } from './validator/min-fps.validator';
import { IsAudioValidator } from './validator/is-audio.validator';
import { IsImageValidator } from './validator/is-image.validator';
import { IsVideoValidator } from './validator/is-video.validator';
import { IsCodecValidator } from './validator/is-codec.validator';
import { DurationValidator } from './validator/duration.validator';
import { MaxWidthValidator } from './validator/max-width.validator';
import { MinWidthValidator } from './validator/min-width.validator';
import { MaxHeightValidator } from './validator/max-height.validator';
import { MinHeightValidator } from './validator/min-height.validator';
import { MaxDurationValidator } from './validator/max-duration.validator';
import { MinDurationValidator } from './validator/min-duration.validator';
import { AspectRatioValidator } from './validator/aspect-ratio.validator';
import { MinAspectRatioValidator } from './validator/min-aspect-ratio.validator';
import { MaxAspectRatioValidator } from './validator/max-aspect-ratio.validator';

const mediaModuleProviders: Array<Provider> = [
  MediaService,
  // #region 自定义class-validator校验器
  //   #region 媒体类型校验器
  IsAudioValidator,
  IsImageValidator,
  IsVideoValidator,
  //   #endregion

  //   #region 画面尺寸校验器
  WidthValidator,
  HeightValidator,
  MaxWidthValidator,
  MinWidthValidator,
  MaxHeightValidator,
  MinHeightValidator,
  //   #endregion

  //   #region 画面宽高比校验器
  AspectRatioValidator,
  MinAspectRatioValidator,
  MaxAspectRatioValidator,
  //   #endregion

  //   #region 视频帧率校验器
  FpsValidator,
  MinFpsValidator,
  MaxFpsValidator,
  //   #endregion

  //   #region 时长校验器
  DurationValidator,
  MinDurationValidator,
  MaxDurationValidator,
  //   #endregion

  IsCodecValidator,
  // #endregion
];

/**
 * 媒体模块
 *
 * - 全局模块
 */
@Global()
@Module({
  providers: mediaModuleProviders,
  exports: mediaModuleProviders,
})
export class MediaModule {}
