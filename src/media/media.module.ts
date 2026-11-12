import { Global, Module } from '@nestjs/common';
import { MediaService } from './service/media.service';
import { IsVideoFileValidator } from './validator/is-video-file.validator';

/**
 * 媒体模块
 *
 * - 全局模块
 */
@Global()
@Module({
  providers: [MediaService, IsVideoFileValidator],
})
export class MediaModule {}
