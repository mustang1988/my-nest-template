import { IMediaFormat } from './media-format.interface';
import { IMediaAudioStream } from './media-audio-stream.interface';
import { IMediaVideoStream } from './media-video-stream.interface';
import { IMediaSubtitleStream } from './media-subtitle-stream.interface';

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
   * 获取媒体中所有视频流信息
   */
  getVideoStreams(): Array<IMediaVideoStream>;

  /**
   * 获取媒体中指定索引的视频流信息
   * @param index 索引号, 非ffprobe读取到的全局流索引, 单指所有视频流中的第N个
   */
  getVideoStream(index: number): IMediaVideoStream | undefined;

  /**
   * 获取媒体中所有音频流信息
   */
  getAudioStreams(): Array<IMediaAudioStream>;

  /**
   * 获取媒体中指定索引的音频流信息
   * @param index 索引号, 非ffprobe读取到的全局流索引, 单指所有音频流中的第N个
   */
  getAudioStream(index: number): IMediaAudioStream | undefined;

  /**
   * 获取媒体中所有字幕流信息
   */
  getSubtitleStreams(): Array<IMediaSubtitleStream>;

  /**
   * 获取媒体中指定索引的字幕流信息
   * @param index 索引号, 非ffprobe读取到的全局流索引, 单指所有音频流中的第N个
   */
  getSubtitleStream(index: number): IMediaSubtitleStream | undefined;

  /**
   * 媒体是否为视频
   */
  isVideoMedia(): boolean;

  /**
   * 媒体是否为图片
   */
  isImageMedia(): boolean;

  /**
   * 媒体是否为音频
   */
  isAudioMedia(): boolean;

  /**
   * 媒体是否为字幕
   */
  isSubtitleMedia(): boolean;

  /**
   * 媒体中是否包含视频流
   */
  hasVideoStream(): boolean;

  /**
   * 媒体中是否包含音频流
   */
  hasAudioStream(): boolean;

  /**
   * 媒体中是否包含字幕流
   */
  hasSubtitleStream(): boolean;

  /**
   * 获取媒体时长, 单位: 秒
   *
   * 图片媒体或时长未知时返回undefined;
   *
   * 优先取主流(视频取第1条视频流, 音频取第1条音频流)的流级时长
   *
   * 流级时长缺失时(ffprobe对流级时长输出"N/A", 数值转换后为NaN)回退取容器级时长(format.duration)
   *
   * @return 媒体时长
   */
  getDuration(): number | undefined;
}
