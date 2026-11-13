import { sortBy } from 'lodash';
import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { MediaStream } from './media-stream.impl';
import { MediaFormat } from './media-format.impl';
import { IMAGE_DEMUXER } from '../media.constant';
import { IMedia } from '../interface/media.interface';
import { MediaVideoStream } from './media-video-stream.impl';
import { MediaAudioStream } from './media-audio-stream.impl';
import { IMediaFormat } from '../interface/media-format.interface';
import { IMediaAudioStream } from '../interface/media-audio-stream.interface';
import { IMediaVideoStream } from '../interface/media-video-stream.interface';

/**
 * 媒体
 */
export class Media implements IMedia {
  @Type(() => MediaStream, {
    discriminator: {
      property: 'codec_type',
      subTypes: [
        { name: 'video', value: MediaVideoStream }, // codec_type属性值为'video'时转换为MediaVideoStream实例
        { name: 'audio', value: MediaAudioStream }, // codec_type属性值为'audio'时转换为MediaAudioStream实例
      ],
    },
    keepDiscriminatorProperty: true,
  })
  @IsOptional()
  streams: Array<MediaVideoStream | MediaAudioStream>;

  @Type(() => MediaFormat)
  @IsOptional()
  format?: IMediaFormat | undefined;

  getVideoStreams(): Array<IMediaVideoStream> {
    return sortBy(
      this.streams.filter((s) => s instanceof MediaVideoStream),
      'index',
      'asc',
    ) as Array<IMediaVideoStream>;
  }

  getVideoStream(index: number): IMediaVideoStream | undefined {
    return this.getVideoStreams()[index];
  }

  getAudioStreams(): Array<IMediaAudioStream> {
    return sortBy(
      this.streams.filter((s) => s instanceof MediaAudioStream),
      'index',
      'asc',
    ) as Array<IMediaAudioStream>;
  }

  getAudioStream(index: number): IMediaAudioStream | undefined {
    return this.getAudioStreams()[index];
  }

  isVideoMedia(): boolean {
    return this.hasVideoStream() && !this.isImageMedia();
  }

  isImageMedia(): boolean {
    return IMAGE_DEMUXER.includes(this.format?.format_name ?? '');
  }

  isAudioMedia(): boolean {
    return this.hasAudioStream() && !this.isVideoMedia() && !this.isImageMedia();
  }

  hasVideoStream(): boolean {
    return this.getVideoStreams().length > 0;
  }

  hasAudioStream(): boolean {
    return this.getAudioStreams().length > 0;
  }
}
