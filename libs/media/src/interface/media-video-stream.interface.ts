/**
 * 媒体视频流
 */
export interface IMediaVideoStream {
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
  profile: string;

  /**
   * 编码类型
   *
   * 视频流的编码类型固定为: 'video'
   */
  codec_type: string;
  codec_tag_string: string;
  codec_tag: string;

  /**
   * 宽度
   *
   * 单位: px
   */
  width: number;

  /**
   * 高度
   *
   * 单位: px
   */
  height: number;
  coded_width: number;
  coded_height: number;
  closed_captions: number;
  film_grain: number;
  has_b_frames: number;

  /**
   * 采样宽高比
   */
  sample_aspect_ratio: string;

  /**
   * 显示宽高比
   */
  display_aspect_ratio: string;

  /**
   * 像素格式
   */
  pix_fmt: string;
  level: number;

  /**
   * 色彩范围
   */
  color_range: string;

  /**
   * 色彩空间
   */
  color_space: string;
  color_transfer: string;
  color_primaries: string;
  chroma_location: string;
  refs: number;
  view_ids_available: string;
  view_pos_available: string;
  id: string;
  r_frame_rate: string;

  /**
   * 平均帧率
   */
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
   */
  duration: number;

  /**
   * 比特率
   *
   * 单位: bps
   */
  bit_rate: number;

  /**
   * 帧数
   */
  nb_frames: number;
  extradata_size: number;
  disposition: Record<string, unknown>;

  /**
   * 视频流标签
   */
  tags: Record<string, unknown>;
}
