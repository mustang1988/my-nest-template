/**
 * 媒体格式信息
 */
export interface IMediaFormat {
  /**
   * 媒体文件的文件名或URL
   */
  filename: string;

  /**
   * 媒体文件流数量
   */
  nb_streams: number;
  nb_programs: number;
  nb_stream_groups: number;

  /**
   * 格式名
   */
  format_name: string;

  /**
   * 格式名全名
   */
  format_long_name: string;

  /**
   * 开始时间
   */
  start_time: number;

  /**
   * 时长
   *
   * 单位: 秒
   */
  duration: number;

  /**
   * 大小
   *
   * 单位: 字节
   */
  size: number;

  /**
   * 比特率
   *
   * 单位: bps
   */
  bit_rate: number;

  /**
   * 探测得分
   *
   * 百分制, 分值越高数据可信度越高
   */
  probe_score: number;

  /**
   * 格式标签
   */
  tags: Record<string, unknown>;
}
