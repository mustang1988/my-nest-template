import { Type } from 'class-transformer';
import { MediaStream } from './media-stream.impl';
import { IsNumber, IsObject, IsOptional, IsString } from 'class-validator';
import { IMediaSubtitleStream } from '../interface/media-subtitle-stream.interface';

/**
 * 媒体字幕流
 */
export class MediaSubtitleStream extends MediaStream implements IMediaSubtitleStream {
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
  codec_tag_string: string;

  @Type(() => String)
  @IsString()
  @IsOptional()
  codec_tag: string;

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

  @IsObject()
  @IsOptional()
  disposition: Record<string, unknown>;
}
