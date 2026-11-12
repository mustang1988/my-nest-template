import { IMediaFormat } from './media-format.interface';
import { IMediaAudioStream } from './media-audio-stream.interface';
import { IMediaVideoStream } from './media-video-stream.interface';

/**
 * 媒体
 */
export interface IMedia {
  /**
   * 媒体流信息
   */
  streams: Array<IMediaAudioStream | IMediaVideoStream>;

  /**
   * 媒体格式信息
   */
  format?: IMediaFormat;

  getVideoStreams(): Array<IMediaVideoStream>;

  getVideoStream(index: number): IMediaVideoStream | undefined;

  getAudioStreams(): Array<IMediaAudioStream>;

  getAudioStream(index: number): IMediaAudioStream | undefined;
}
