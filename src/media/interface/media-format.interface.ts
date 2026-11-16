/**
 * 媒体格式信息
 */
export interface IMediaFormat {
  filename: string;
  nb_streams: number;
  nb_programs: number;
  nb_stream_groups: number;
  format_name: string;
  format_long_name: string;
  start_time: number;
  duration: number;
  size: number;
  bit_rate: number;
  probe_score: number;
  tags: Record<string, unknown>;
}
