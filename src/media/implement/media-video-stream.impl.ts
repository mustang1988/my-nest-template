import { Type } from 'class-transformer';
import { MediaStream } from './media-stream.impl';
import { IsString, IsOptional, IsNumber } from 'class-validator';
import { IMediaVideoStream } from '../interface/media-video-stream.interface';

/**
 * 媒体视频流
 */
export class MediaVideoStream extends MediaStream implements IMediaVideoStream {
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

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  width: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  height: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  coded_width: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  coded_height: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  closed_captions: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  film_grain: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  has_b_frames: number;

  @Type(() => String)
  @IsString()
  @IsOptional()
  sample_aspect_ratio: string;

  @Type(() => String)
  @IsString()
  @IsOptional()
  display_aspect_ratio: string;

  @Type(() => String)
  @IsString()
  @IsOptional()
  pix_fmt: string;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  level: number;

  @Type(() => String)
  @IsString()
  @IsOptional()
  color_range: string;

  @Type(() => String)
  @IsString()
  @IsOptional()
  color_space: string;

  @Type(() => String)
  @IsString()
  @IsOptional()
  color_transfer: string;

  @Type(() => String)
  @IsString()
  @IsOptional()
  color_primaries: string;

  @Type(() => String)
  @IsString()
  @IsOptional()
  chroma_location: string;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  refs: number;

  @Type(() => String)
  @IsString()
  @IsOptional()
  view_ids_available: string;

  @Type(() => String)
  @IsString()
  @IsOptional()
  view_pos_available: string;

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
