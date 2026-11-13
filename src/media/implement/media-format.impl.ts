import { Type } from 'class-transformer';
import { IMediaFormat } from '../interface/media-format.interface';
import { IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

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

  @IsObject()
  @IsOptional()
  tags: Record<string, unknown>;
}
