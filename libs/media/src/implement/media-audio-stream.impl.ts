import { Type } from 'class-transformer';
import { MediaStream } from './media-stream.impl';
import { IsString, IsOptional, IsNumber, IsObject } from 'class-validator';
import { IMediaAudioStream } from '../interface/media-audio-stream.interface';

/**
 * 媒体音频流
 * 示例:
 * {
 *     "index": 1,
 *     "codec_name": "eac3",
 *     "codec_long_name": "ATSC A/52B (AC-3, E-AC-3)",
 *     "profile": "Dolby Digital Plus + Dolby Atmos",
 *     "codec_type": "audio",
 *     "codec_tag_string": "[0][0][0][0]",
 *     "codec_tag": "0x0000",
 *     "sample_fmt": "fltp",
 *     "sample_rate": "48000",
 *     "channels": 6,
 *     "channel_layout": "5.1(side)",
 *     "bits_per_sample": 0,
 *     "initial_padding": 0,
 *     "r_frame_rate": "0/0",
 *     "avg_frame_rate": "0/0",
 *     "time_base": "1/1000",
 *     "start_pts": 0,
 *     "start_time": "0.000000",
 *     "bit_rate": "768000",
 *     "disposition": {
 *         "default": 1,
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
 *         "language": "eng",
 *         "BPS": "768000",
 *         "DURATION": "00:52:27.840000000",
 *         "NUMBER_OF_FRAMES": "98370",
 *         "NUMBER_OF_BYTES": "302192640",
 *         "_STATISTICS_WRITING_APP": "mkvmerge v61.0.0.39 ('So') 64-bit",
 *         "_STATISTICS_WRITING_DATE_UTC": "2021-10-20 23:33:48",
 *         "_STATISTICS_TAGS": "BPS DURATION NUMBER_OF_FRAMES NUMBER_OF_BYTES"
 *     }
 * }
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

  @IsObject()
  @IsOptional()
  disposition: Record<string, unknown>;

  @IsObject()
  @IsOptional()
  tags: Record<string, unknown>;
}
