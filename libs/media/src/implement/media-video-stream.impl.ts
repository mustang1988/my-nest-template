import { Type } from 'class-transformer';
import { MediaStream } from './media-stream.impl';
import { IsString, IsOptional, IsNumber, IsObject } from 'class-validator';
import { IMediaVideoStream } from '../interface/media-video-stream.interface';

/**
 * 媒体视频流
 * 示例:
 * {
 *     "index": 0,
 *     "codec_name": "hevc",
 *     "codec_long_name": "H.265 / HEVC (High Efficiency Video Coding)",
 *     "profile": "Main 10",
 *     "codec_type": "video",
 *     "codec_tag_string": "[0][0][0][0]",
 *     "codec_tag": "0x0000",
 *     "width": 3840,
 *     "height": 2160,
 *     "coded_width": 3840,
 *     "coded_height": 2160,
 *     "closed_captions": 0,
 *     "film_grain": 0,
 *     "has_b_frames": 2,
 *     "sample_aspect_ratio": "1:1",
 *     "display_aspect_ratio": "16:9",
 *     "pix_fmt": "yuv420p10le",
 *     "level": 150,
 *     "color_range": "tv",
 *     "color_space": "bt2020nc",
 *     "color_transfer": "smpte2084",
 *     "color_primaries": "bt2020",
 *     "chroma_location": "topleft",
 *     "refs": 1,
 *     "view_ids_available": "",
 *     "view_pos_available": "",
 *     "r_frame_rate": "24000/1001",
 *     "avg_frame_rate": "24000/1001",
 *     "time_base": "1/1000",
 *     "start_pts": 0,
 *     "start_time": "0.000000",
 *     "extradata_size": 137,
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
 *         "BPS": "13996798",
 *         "DURATION": "00:50:44.583000000",
 *         "NUMBER_OF_FRAMES": "72997",
 *         "NUMBER_OF_BYTES": "5326801877",
 *         "_STATISTICS_WRITING_APP": "mkvmerge v61.0.0.39 ('So') 64-bit",
 *         "_STATISTICS_WRITING_DATE_UTC": "2021-10-20 23:33:48",
 *         "_STATISTICS_TAGS": "BPS DURATION NUMBER_OF_FRAMES NUMBER_OF_BYTES"
 *     },
 *     "side_data_list": [
 *         {
 *             "side_data_type": "DOVI configuration record",
 *             "dv_version_major": 1,
 *             "dv_version_minor": 0,
 *             "dv_profile": 8,
 *             "dv_level": 6,
 *             "rpu_present_flag": 1,
 *             "el_present_flag": 0,
 *             "bl_present_flag": 1,
 *             "dv_bl_signal_compatibility_id": 1,
 *             "dv_md_compression": "none"
 *         }
 *     ]
 * }
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

  @IsObject()
  @IsOptional()
  disposition: Record<string, unknown>;

  @IsObject()
  @IsOptional()
  tags: Record<string, unknown>;
}
