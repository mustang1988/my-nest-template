/**
 * 媒体字幕流
 */
export interface IMediaSubtitleStream {
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
   * 编码类型
   *
   * 视频流的编码类型固定为: 'subtitle'
   */
  codec_type: string;

  codec_tag_string: string;
  codec_tag: string;
  r_frame_rate: string;
  avg_frame_rate: string;
  time_base: string;
  disposition: Record<string, unknown>;
}
