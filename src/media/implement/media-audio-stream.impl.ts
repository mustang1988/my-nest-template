import { Type } from 'class-transformer';
import { MediaStream } from './media-stream.impl';
import { IsString, IsOptional, IsNumber } from 'class-validator';
import { IMediaAudioStream } from '../interface/media-audio-stream.interface';

/**
 * 媒体音频流
 */
export class MediaAudioStream extends MediaStream implements IMediaAudioStream {
  @Type(() => Number)
  @IsNumber()
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
  @IsNumber()
  @IsOptional()
  sample_rate: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  channels: number;

  @Type(() => String)
  @IsString()
  @IsOptional()
  channel_layout: string;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  bits_per_sample: number;

  @Type(() => Number)
  @IsNumber()
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
  @IsNumber()
  @IsOptional()
  start_pts: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  start_time: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  duration_ts: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  duration: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  bit_rate: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  nb_frames: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  extradata_size: number;

  @IsString()
  @IsOptional()
  disposition: Record<string, unknown>;

  @IsString()
  @IsOptional()
  tags: Record<string, unknown>;
}
