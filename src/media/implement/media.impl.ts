import { sortBy } from 'lodash';
import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { MediaStream } from './media-stream.impl';
import { MediaFormat } from './media-format.impl';
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
        { name: 'video', value: MediaVideoStream },
        { name: 'audio', value: MediaAudioStream },
      ],
    },
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
}
