/**
 * 媒体音频流
 */
export interface IMediaAudioStream {
  /**
   * 全局流索引
   */
  index: number;

  /**
   * 编码器名称
   */
  codec_name: string;

  /**
   * 编码器全名
   */
  codec_long_name: string;

  /**
   * 编码器预设
   */
  profile: string;

  /**
   * 编码类型
   *
   * 视频流的编码类型固定为: 'audio'
   */
  codec_type: string;
  codec_tag_string: string;
  codec_tag: string;

  /**
   * 采样格式
   */
  sample_fmt: string;

  /**
   * 采样率
   *
   * 单位: Hz
   */
  sample_rate: number;

  /**
   * 通道数
   */
  channels: number;

  /**
   * 通道布局
   */
  channel_layout: string;
  bits_per_sample: number;
  initial_padding: number;
  id: string;
  r_frame_rate: string;
  avg_frame_rate: string;
  time_base: string;

  /**
   * 起始时间戳
   */
  start_pts: number;

  /**
   * 开始时间
   */
  start_time: number;
  duration_ts: number;

  /**
   * 时长
   *
   * 单位: 秒
   */
  duration: number;

  /**
   * 比特率
   *
   * 单位: bps
   */
  bit_rate: number;
  nb_frames: number;
  extradata_size: number;
  disposition: Record<string, unknown>;

  /**
   * 音频流标签
   */
  tags: Record<string, unknown>;
}
