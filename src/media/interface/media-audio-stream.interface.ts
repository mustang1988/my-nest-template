/**
 * 媒体音频流
 */
export interface IMediaAudioStream {
  index: number;
  codec_name: string;
  codec_long_name: string;
  profile: string;
  codec_type: string;
  codec_tag_string: string;
  codec_tag: string;
  sample_fmt: string;
  sample_rate: number;
  channels: number;
  channel_layout: string;
  bits_per_sample: number;
  initial_padding: number;
  id: string;
  r_frame_rate: string;
  avg_frame_rate: string;
  time_base: string;
  start_pts: number;
  start_time: number;
  duration_ts: number;
  duration: number;
  bit_rate: number;
  nb_frames: number;
  extradata_size: number;
  disposition: Record<string, unknown>;
  tags: Record<string, unknown>;
}
