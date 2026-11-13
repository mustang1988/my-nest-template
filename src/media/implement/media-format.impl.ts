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
  @IsNumber()
  @IsOptional()
  nb_streams: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  nb_programs: number;

  @Type(() => Number)
  @IsNumber()
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
  @IsNumber()
  @IsOptional()
  start_time: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  duration: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  size: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  bit_rate: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  probe_score: number;

  @Type(() => Map<string, unknown>)
  @IsString()
  @IsOptional()
  tags: Record<string, unknown>;
}
