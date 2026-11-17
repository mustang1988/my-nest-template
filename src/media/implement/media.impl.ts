import { sortBy } from 'lodash';
import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { MediaFormat } from './media-format.impl';
import { MediaStream } from './media-stream.impl';
import { IMAGE_DEMUXER } from '../media.constant';
import { IMedia } from '../interface/media.interface';
import { MediaAudioStream } from './media-audio-stream.impl';
import { MediaVideoStream } from './media-video-stream.impl';
import { IMediaFormat } from '../interface/media-format.interface';
import { MediaSubtitleStream } from './media-subtitle-stream.impl';
import { IMediaAudioStream } from '../interface/media-audio-stream.interface';
import { IMediaVideoStream } from '../interface/media-video-stream.interface';
import { IMediaSubtitleStream } from '../interface/media-subtitle-stream.interface';

/**
 * 媒体
 */
export class Media implements IMedia {
  @Type(() => MediaStream, {
    discriminator: {
      property: 'codec_type',
      subTypes: [
        { name: 'video', value: MediaVideoStream }, // 视频流
        { name: 'audio', value: MediaAudioStream }, // 音频流
        { name: 'subtitle', value: MediaSubtitleStream }, // 字幕流
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

  getSubtitleStreams(): Array<IMediaSubtitleStream> {
    return sortBy(
      this.streams.filter((s) => s instanceof MediaSubtitleStream),
      'index',
      'asc',
    ) as Array<IMediaSubtitleStream>;
  }

  getSubtitleStream(index: number): IMediaSubtitleStream | undefined {
    return this.getSubtitleStreams()[index];
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

  isSubtitleMedia(): boolean {
    return !this.isAudioMedia() && !this.isImageMedia() && !this.isVideoMedia() && this.hasSubtitleStream();
  }

  hasVideoStream(): boolean {
    return this.getVideoStreams().length > 0;
  }

  hasAudioStream(): boolean {
    return this.getAudioStreams().length > 0;
  }

  hasSubtitleStream(): boolean {
    return this.getSubtitleStreams().length > 0;
  }

  getDuration(): number | undefined {
    if (this.isImageMedia()) {
      return undefined;
    }
    let duration: number | undefined = undefined;
    if (this.isVideoMedia()) {
      duration = this.getVideoStream(0)?.duration;
    }
    if (this.isAudioMedia()) {
      duration = this.getAudioStream(0)?.duration;
    }
    /**
     * 流级时长缺失或不可用时回退取容器级时长
     */
    if (duration === undefined || Number.isNaN(duration)) {
      duration = this.format?.duration;
    }
    return duration !== undefined && !Number.isNaN(duration) ? duration : undefined;
  }
}
