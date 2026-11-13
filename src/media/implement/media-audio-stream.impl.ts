import { Type } from 'class-transformer';
import { MediaStream } from './media-stream.impl';
import { IsString, IsOptional } from 'class-validator';
import { IMediaAudioStream } from '../interface/media-audio-stream.interface';

/**
 * 媒体音频流
 */
export class MediaAudioStream extends MediaStream implements IMediaAudioStream {
  @Type(() => Number)
  @IsString()
  @IsOptional()
  index: number;

  @Type(() => String)
  @IsString()
  @IsOptional()
  codec_name: string;

  @Type(() => String)
  @IsString()
  @IsOptional()
  codec_long_name: string;

  @Type(() => String)
  @IsString()
  @IsOptional()
  profile: string;

  @Type(() => String)
  @IsString()
  @IsOptional()
  codec_tag_string: string;

  @Type(() => String)
  @IsString()
  @IsOptional()
  codec_tag: string;

  @Type(() => String)
  @IsString()
  @IsOptional()
  sample_fmt: string;

  @Type(() => Number)
  @IsString()
  @IsOptional()
  sample_rate: number;

  @Type(() => Number)
  @IsString()
  @IsOptional()
  channels: number;

  @Type(() => String)
  @IsString()
  @IsOptional()
  channel_layout: string;

  @Type(() => Number)
  @IsString()
  @IsOptional()
  bits_per_sample: number;

  @Type(() => Number)
  @IsString()
  @IsOptional()
  initial_padding: number;

  @Type(() => String)
  @IsString()
  @IsOptional()
  id: string;

  @Type(() => String)
  @IsString()
  @IsOptional()
  r_frame_rate: string;

  @Type(() => String)
  @IsString()
  @IsOptional()
  avg_frame_rate: string;

  @Type(() => String)
  @IsString()
  @IsOptional()
  time_base: string;

  @Type(() => Number)
  @IsString()
  @IsOptional()
  start_pts: number;

  @Type(() => Number)
  @IsString()
  @IsOptional()
  start_time: number;

  @Type(() => Number)
  @IsString()
  @IsOptional()
  duration_ts: number;

  @Type(() => Number)
  @IsString()
  @IsOptional()
  duration: number;

  @Type(() => Number)
  @IsString()
  @IsOptional()
  bit_rate: number;

  @Type(() => Number)
  @IsString()
  @IsOptional()
  nb_frames: number;

  @Type(() => Number)
  @IsString()
  @IsOptional()
  extradata_size: number;

  @Type(() => Map<string, unknown>)
  @IsString()
  @IsOptional()
  disposition: Record<string, unknown>;

  @Type(() => Map<string, unknown>)
  @IsString()
  @IsOptional()
  tags: Record<string, unknown>;
}
