import { MediaService } from './service/media.service';
import { Global, Module, Provider } from '@nestjs/common';
import { WidthValidator } from './validator/width.validator';
import { HeightValidator } from './validator/height.validator';
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
