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

  /**
   * 获取所有媒体视频流信息
   */
  getVideoStreams(): Array<IMediaVideoStream>;

  /**
   * 获取指定索引的媒体视频流信息
   */
  getVideoStream(index: number): IMediaVideoStream | undefined;

  /**
   * 获取所有媒体音频流信息
   */
  getAudioStreams(): Array<IMediaAudioStream>;

  /**
   * 获取指定索引的媒体音频流信息
   */
  getAudioStream(index: number): IMediaAudioStream | undefined;
}
