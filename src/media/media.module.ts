import { Global, Module } from '@nestjs/common';
import { MediaService } from './service/media.service';

/**
 * 媒体模块
 *
 * - 全局模块
 */
@Global()
@Module({
  providers: [MediaService],
})
export class MediaModule {}
