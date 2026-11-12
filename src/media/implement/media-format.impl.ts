import { Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { IMediaFormat } from '../interface/media-format.interface';

/**
 * 媒体格式
 */
export class MediaFormat implements IMediaFormat {
  @Type(() => String)
  @IsString()
  @IsOptional()
  filename: string;

  @Type(() => Number)
  @IsString()
  @IsOptional()
  nb_streams: number;

  @Type(() => Number)
  @IsString()
  @IsOptional()
  nb_programs: number;

  @Type(() => Number)
  @IsString()
  @IsOptional()
  nb_stream_groups: number;

  @Type(() => String)
  @IsString()
  @IsOptional()
  format_name: string;

  @Type(() => String)
  @IsString()
  @IsOptional()
  format_long_name: string;

  @Type(() => Number)
  @IsString()
  @IsOptional()
  start_time: number;

  @Type(() => Number)
  @IsString()
  @IsOptional()
  duration: number;

  @Type(() => Number)
  @IsString()
  @IsOptional()
  size: number;

  @Type(() => Number)
  @IsString()
  @IsOptional()
  bit_rate: number;

  @Type(() => Number)
  @IsString()
  @IsOptional()
  probe_score: number;

  @Type(() => Map<string, unknown>)
  @IsString()
  @IsOptional()
  tags: Record<string, unknown>;
}
