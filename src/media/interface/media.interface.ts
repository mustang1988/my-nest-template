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
   * @param index 索引号, 非ffprobe读取到的全局流索引, 单指所有视频流中的第N个
   */
  getVideoStream(index: number): IMediaVideoStream | undefined;

  /**
   * 获取所有媒体音频流信息
   */
  getAudioStreams(): Array<IMediaAudioStream>;

  /**
   * 获取指定索引的媒体音频流信息
   * @param index 索引号, 非ffprobe读取到的全局流索引, 单指所有音频流中的第N个
   */
  getAudioStream(index: number): IMediaAudioStream | undefined;

  /**
   * 是否为视频媒体
   */
  isVideoMedia(): boolean;

  /**
   * 是否为图片媒体
   */
  isImageMedia(): boolean;

  /**
   * 是否为音频媒体
   */
  isAudioMedia(): boolean;

  /**
   * 媒体中是否包含视频流
   */
  hasVideoStream(): boolean;

  /**
   * 媒体中是否包含音频流
   */
  hasAudioStream(): boolean;

  /**
   * 获取媒体时长
   *
   * 图片媒体或时长未知时返回undefined; 优先取主流(视频取第1条视频流, 音频取第1条音频流)的流级时长,
   * 流级时长缺失时(ffprobe对流级时长输出"N/A", 数值转换后为NaN)回退取容器级时长(format.duration)
   *
   * @return 媒体时长(单位: 秒)
   */
  getDuration(): number | undefined;
}
