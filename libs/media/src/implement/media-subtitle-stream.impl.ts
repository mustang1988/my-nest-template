import { Type } from 'class-transformer';
import { MediaStream } from './media-stream.impl';
import { IsNumber, IsObject, IsOptional, IsString } from 'class-validator';
import { IMediaSubtitleStream } from '../interface/media-subtitle-stream.interface';

/**
 * 媒体字幕流
 * 示例:
 * {
 *     "index": 33,
 *     "codec_name": "subrip",
 *     "codec_long_name": "SubRip subtitle",
 *     "codec_type": "subtitle",
 *     "codec_tag_string": "[0][0][0][0]",
 *     "codec_tag": "0x0000",
 *     "r_frame_rate": "0/0",
 *     "avg_frame_rate": "0/0",
 *     "time_base": "1/1000",
 *     "start_pts": 0,
 *     "start_time": "0.000000",
 *     "duration_ts": 3147840,
 *     "duration": "3147.840000",
 *     "disposition": {
 *         "default": 0,
 *         "dub": 0,
 *         "original": 0,
 *         "comment": 0,
 *         "lyrics": 0,
 *         "karaoke": 0,
 *         "forced": 0,
 *         "hearing_impaired": 0,
 *         "visual_impaired": 0,
 *         "clean_effects": 0,
 *         "attached_pic": 0,
 *         "timed_thumbnails": 0,
 *         "non_diegetic": 0,
 *         "captions": 0,
 *         "descriptions": 0,
 *         "metadata": 0,
 *         "dependent": 0,
 *         "still_image": 0,
 *         "multilayer": 0
 *     },
 *     "tags": {
 *         "language": "chi",
 *         "title": "Simplified",
 *         "BPS": "54",
 *         "DURATION": "00:50:23.020000000",
 *         "NUMBER_OF_FRAMES": "590",
 *         "NUMBER_OF_BYTES": "20693",
 *         "_STATISTICS_WRITING_APP": "mkvmerge v61.0.0.39 ('So') 64-bit",
 *         "_STATISTICS_WRITING_DATE_UTC": "2021-10-20 23:33:48",
 *         "_STATISTICS_TAGS": "BPS DURATION NUMBER_OF_FRAMES NUMBER_OF_BYTES"
 *     }
 * }
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

  @IsObject()
  @IsOptional()
  disposition: Record<string, unknown>;

  @IsObject()
  @IsOptional()
  tags: Record<string, unknown>;
}
