import { Global, Module } from '@nestjs/common';
import { MediaService } from './service/media.service';
import { IsAudioValidator } from './validator/is-audio.validator';
import { IsImageValidator } from './validator/is-image.validator';
import { IsVideoValidator } from './validator/is-video.validator';
import { DurationValidator } from './validator/duration.validator';
import { MinDurationValidator } from './validator/min-duration.validator';
import { MaxDurationValidator } from './validator/max-duration.validator';

/**
 * 媒体模块
 *
 * - 全局模块
 */
@Global()
@Module({
  providers: [MediaService, IsAudioValidator, IsImageValidator, IsVideoValidator, DurationValidator, MinDurationValidator, MaxDurationValidator],
  exports: [MediaService, IsAudioValidator, IsImageValidator, IsVideoValidator, DurationValidator, MinDurationValidator, MaxDurationValidator],
})
export class MediaModule {}
