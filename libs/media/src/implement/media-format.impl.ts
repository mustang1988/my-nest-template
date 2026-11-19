import { Type } from 'class-transformer';
import { IMediaFormat } from '../interface/media-format.interface';
import { IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

/**
 * 媒体格式
 * 示例:
 * {
 *     "filename": "Shadow.And.Bone.S01E01.2160p.NF.WEB-DL.DDPA5.1.HDR.DV.HEVC-ABBIE.mkv",
 *     "nb_streams": 35,
 *     "nb_programs": 0,
 *     "nb_stream_groups": 0,
 *     "format_name": "matroska,webm",
 *     "format_long_name": "Matroska / WebM",
 *     "start_time": "0.000000",
 *     "duration": "3147.840000",
 *     "size": "5631261091",
 *     "bit_rate": "14311429",
 *     "probe_score": 100,
 *     "tags": {
 *         "encoder": "libebml v1.4.2 + libmatroska v1.6.4",
 *         "creation_time": "2021-10-20T23:33:48.000000Z"
 *     }
 * }
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
