import { tmpdir } from 'node:os';
import { Test } from '@nestjs/testing';
import { randomUUID } from 'node:crypto';
import { MediaModule } from './media.module';
import { rm, writeFile } from 'node:fs/promises';
import { basename, extname, join } from 'node:path';
import { LoggerModule } from 'src/logger/logger.module';
import { ContextModule } from 'src/context/context.module';
import { ConfigurationModule } from 'src/configuration/configuration.module';
import { InternationalizationModule } from 'src/internationalization/internationalization.module';

// #region 测试文件下载地址
/**
 * 测试用视频文件
 */
export const TEST_VIDEOS = [
  /**
   * 测试用视频1
   * 文件信息:
   * {
   *     "streams": [
   *         {
   *             "index": 0,
   *             "codec_name": "hevc",
   *             "codec_long_name": "H.265 / HEVC (High Efficiency Video Coding)",
   *             "profile": "Main 10",
   *             "codec_type": "video",
   *             "codec_tag_string": "[0][0][0][0]",
   *             "codec_tag": "0x0000",
   *             "width": 3840,
   *             "height": 2160,
   *             "coded_width": 3840,
   *             "coded_height": 2160,
   *             "closed_captions": 0,
   *             "film_grain": 0,
   *             "has_b_frames": 2,
   *             "sample_aspect_ratio": "1:1",
   *             "display_aspect_ratio": "16:9",
   *             "pix_fmt": "yuv420p10le",
   *             "level": 150,
   *             "color_range": "tv",
   *             "color_space": "bt2020nc",
   *             "color_transfer": "smpte2084",
   *             "color_primaries": "bt2020",
   *             "chroma_location": "topleft",
   *             "refs": 1,
   *             "view_ids_available": "",
   *             "view_pos_available": "",
   *             "r_frame_rate": "24000/1001",
   *             "avg_frame_rate": "24000/1001",
   *             "time_base": "1/1000",
   *             "start_pts": 120,
   *             "start_time": "0.120000",
   *             "extradata_size": 137,
   *             "disposition": {
   *                 "default": 1,
   *                 "dub": 0,
   *                 "original": 0,
   *                 "comment": 0,
   *                 "lyrics": 0,
   *                 "karaoke": 0,
   *                 "forced": 0,
   *                 "hearing_impaired": 0,
   *                 "visual_impaired": 0,
   *                 "clean_effects": 0,
   *                 "attached_pic": 0,
   *                 "timed_thumbnails": 0,
   *                 "non_diegetic": 0,
   *                 "captions": 0,
   *                 "descriptions": 0,
   *                 "metadata": 0,
   *                 "dependent": 0,
   *                 "still_image": 0,
   *                 "multilayer": 0
   *             },
   *             "tags": {
   *                 "BPS": "13996798",
   *                 "NUMBER_OF_FRAMES": "72997",
   *                 "NUMBER_OF_BYTES": "5326801877",
   *                 "_STATISTICS_WRITING_APP": "mkvmerge v61.0.0.39 ('So') 64-bit",
   *                 "_STATISTICS_WRITING_DATE_UTC": "2021-10-20 23:33:48",
   *                 "_STATISTICS_TAGS": "BPS DURATION NUMBER_OF_FRAMES NUMBER_OF_BYTES",
   *                 "DURATION": "00:00:05.166000000"
   *             },
   *             "side_data_list": [
   *                 {
   *                     "side_data_type": "DOVI configuration record",
   *                     "dv_version_major": 1,
   *                     "dv_version_minor": 0,
   *                     "dv_profile": 8,
   *                     "dv_level": 6,
   *                     "rpu_present_flag": 1,
   *                     "el_present_flag": 0,
   *                     "bl_present_flag": 1,
   *                     "dv_bl_signal_compatibility_id": 1,
   *                     "dv_md_compression": "none"
   *                 }
   *             ]
   *         },
   *         {
   *             "index": 1,
   *             "codec_name": "eac3",
   *             "codec_long_name": "ATSC A/52B (AC-3, E-AC-3)",
   *             "profile": "Dolby Digital Plus + Dolby Atmos",
   *             "codec_type": "audio",
   *             "codec_tag_string": "[0][0][0][0]",
   *             "codec_tag": "0x0000",
   *             "sample_fmt": "fltp",
   *             "sample_rate": "48000",
   *             "channels": 6,
   *             "channel_layout": "5.1(side)",
   *             "bits_per_sample": 0,
   *             "initial_padding": 0,
   *             "r_frame_rate": "0/0",
   *             "avg_frame_rate": "0/0",
   *             "time_base": "1/1000",
   *             "start_pts": 0,
   *             "start_time": "0.000000",
   *             "bit_rate": "768000",
   *             "disposition": {
   *                 "default": 1,
   *                 "dub": 0,
   *                 "original": 0,
   *                 "comment": 0,
   *                 "lyrics": 0,
   *                 "karaoke": 0,
   *                 "forced": 0,
   *                 "hearing_impaired": 0,
   *                 "visual_impaired": 0,
   *                 "clean_effects": 0,
   *                 "attached_pic": 0,
   *                 "timed_thumbnails": 0,
   *                 "non_diegetic": 0,
   *                 "captions": 0,
   *                 "descriptions": 0,
   *                 "metadata": 0,
   *                 "dependent": 0,
   *                 "still_image": 0,
   *                 "multilayer": 0
   *             },
   *             "tags": {
   *                 "language": "eng",
   *                 "BPS": "768000",
   *                 "NUMBER_OF_FRAMES": "98370",
   *                 "NUMBER_OF_BYTES": "302192640",
   *                 "_STATISTICS_WRITING_APP": "mkvmerge v61.0.0.39 ('So') 64-bit",
   *                 "_STATISTICS_WRITING_DATE_UTC": "2021-10-20 23:33:48",
   *                 "_STATISTICS_TAGS": "BPS DURATION NUMBER_OF_FRAMES NUMBER_OF_BYTES",
   *                 "DURATION": "00:00:05.024000000"
   *             }
   *         },
   *         {
   *             "index": 2,
   *             "codec_name": "subrip",
   *             "codec_long_name": "SubRip subtitle",
   *             "codec_type": "subtitle",
   *             "codec_tag_string": "[0][0][0][0]",
   *             "codec_tag": "0x0000",
   *             "r_frame_rate": "0/0",
   *             "avg_frame_rate": "0/0",
   *             "time_base": "1/1000",
   *             "start_pts": 0,
   *             "start_time": "0.000000",
   *             "duration_ts": 6334,
   *             "duration": "6.334000",
   *             "disposition": {
   *                 "default": 1,
   *                 "dub": 0,
   *                 "original": 0,
   *                 "comment": 0,
   *                 "lyrics": 0,
   *                 "karaoke": 0,
   *                 "forced": 0,
   *                 "hearing_impaired": 0,
   *                 "visual_impaired": 0,
   *                 "clean_effects": 0,
   *                 "attached_pic": 0,
   *                 "timed_thumbnails": 0,
   *                 "non_diegetic": 0,
   *                 "captions": 0,
   *                 "descriptions": 0,
   *                 "metadata": 0,
   *                 "dependent": 0,
   *                 "still_image": 0,
   *                 "multilayer": 0
   *             },
   *             "tags": {
   *                 "language": "eng",
   *                 "title": "[CC]",
   *                 "BPS": "62",
   *                 "NUMBER_OF_FRAMES": "673",
   *                 "NUMBER_OF_BYTES": "21677",
   *                 "_STATISTICS_WRITING_APP": "mkvmerge v61.0.0.39 ('So') 64-bit",
   *                 "_STATISTICS_WRITING_DATE_UTC": "2021-10-20 23:33:48",
   *                 "_STATISTICS_TAGS": "BPS DURATION NUMBER_OF_FRAMES NUMBER_OF_BYTES",
   *                 "DURATION": "00:00:06.334000000"
   *             }
   *         }
   *     ],
   *     "format": {
   *         "filename": "video_1.mkv",
   *         "nb_streams": 3,
   *         "nb_programs": 0,
   *         "nb_stream_groups": 0,
   *         "format_name": "matroska,webm",
   *         "format_long_name": "Matroska / WebM",
   *         "start_time": "0.000000",
   *         "duration": "6.334000",
   *         "size": "9044599",
   *         "bit_rate": "11423554",
   *         "probe_score": 100,
   *         "tags": {
   *             "ENCODER": "Lavf61.7.100"
   *         }
   *     }
   * }
   */
  'http://10.50.2.35:9001/test/media_test_asset/video_1.mkv',

  /**
   * 测试用视频2
   * 文件信息:
   * {
   *     "streams": [
   *         {
   *             "index": 0,
   *             "codec_name": "hevc",
   *             "codec_long_name": "H.265 / HEVC (High Efficiency Video Coding)",
   *             "profile": "Main 10",
   *             "codec_type": "video",
   *             "codec_tag_string": "hvc1",
   *             "codec_tag": "0x31637668",
   *             "width": 3840,
   *             "height": 2160,
   *             "coded_width": 3840,
   *             "coded_height": 2160,
   *             "closed_captions": 0,
   *             "film_grain": 0,
   *             "has_b_frames": 1,
   *             "sample_aspect_ratio": "1:1",
   *             "display_aspect_ratio": "16:9",
   *             "pix_fmt": "yuv420p10le",
   *             "level": 153,
   *             "color_range": "tv",
   *             "color_space": "bt2020nc",
   *             "color_transfer": "smpte2084",
   *             "color_primaries": "bt2020",
   *             "chroma_location": "topleft",
   *             "refs": 1,
   *             "view_ids_available": "",
   *             "view_pos_available": "",
   *             "id": "0x1",
   *             "r_frame_rate": "60000/1001",
   *             "avg_frame_rate": "60000/1001",
   *             "time_base": "1/60000",
   *             "start_pts": 0,
   *             "start_time": "0.000000",
   *             "duration_ts": 301301,
   *             "duration": "5.021683",
   *             "bit_rate": "64738734",
   *             "nb_frames": "301",
   *             "extradata_size": 150,
   *             "disposition": {
   *                 "default": 1,
   *                 "dub": 0,
   *                 "original": 0,
   *                 "comment": 0,
   *                 "lyrics": 0,
   *                 "karaoke": 0,
   *                 "forced": 0,
   *                 "hearing_impaired": 0,
   *                 "visual_impaired": 0,
   *                 "clean_effects": 0,
   *                 "attached_pic": 0,
   *                 "timed_thumbnails": 0,
   *                 "non_diegetic": 0,
   *                 "captions": 0,
   *                 "descriptions": 0,
   *                 "metadata": 0,
   *                 "dependent": 0,
   *                 "still_image": 0,
   *                 "multilayer": 0
   *             },
   *             "tags": {
   *                 "language": "und",
   *                 "handler_name": "Video Media Handler",
   *                 "vendor_id": "[0][0][0][0]",
   *                 "encoder": "HEVC Coding"
   *             }
   *         },
   *         {
   *             "index": 1,
   *             "codec_name": "aac",
   *             "codec_long_name": "AAC (Advanced Audio Coding)",
   *             "profile": "LC",
   *             "codec_type": "audio",
   *             "codec_tag_string": "mp4a",
   *             "codec_tag": "0x6134706d",
   *             "sample_fmt": "fltp",
   *             "sample_rate": "48000",
   *             "channels": 2,
   *             "channel_layout": "stereo",
   *             "bits_per_sample": 0,
   *             "initial_padding": 0,
   *             "id": "0x2",
   *             "r_frame_rate": "0/0",
   *             "avg_frame_rate": "0/0",
   *             "time_base": "1/48000",
   *             "start_pts": 0,
   *             "start_time": "0.000000",
   *             "duration_ts": 240624,
   *             "duration": "5.013000",
   *             "bit_rate": "192000",
   *             "nb_frames": "236",
   *             "extradata_size": 2,
   *             "disposition": {
   *                 "default": 1,
   *                 "dub": 0,
   *                 "original": 0,
   *                 "comment": 0,
   *                 "lyrics": 0,
   *                 "karaoke": 0,
   *                 "forced": 0,
   *                 "hearing_impaired": 0,
   *                 "visual_impaired": 0,
   *                 "clean_effects": 0,
   *                 "attached_pic": 0,
   *                 "timed_thumbnails": 0,
   *                 "non_diegetic": 0,
   *                 "captions": 0,
   *                 "descriptions": 0,
   *                 "metadata": 0,
   *                 "dependent": 0,
   *                 "still_image": 0,
   *                 "multilayer": 0
   *             },
   *             "tags": {
   *                 "language": "eng",
   *                 "handler_name": "Sound Media Handler",
   *                 "vendor_id": "[0][0][0][0]"
   *             }
   *         }
   *     ],
   *     "format": {
   *         "filename": "video_2.mp4",
   *         "nb_streams": 2,
   *         "nb_programs": 0,
   *         "nb_stream_groups": 0,
   *         "format_name": "mov,mp4,m4a,3gp,3g2,mj2",
   *         "format_long_name": "QuickTime / MOV",
   *         "start_time": "0.000000",
   *         "duration": "5.021683",
   *         "size": "40765831",
   *         "bit_rate": "64943694",
   *         "probe_score": 100,
   *         "tags": {
   *             "major_brand": "isom",
   *             "minor_version": "512",
   *             "compatible_brands": "isomiso2mp41",
   *             "encoder": "Lavf61.7.100"
   *         }
   *     }
   * }
   */
  'http://10.50.2.35:9001/test/media_test_asset/video_2.mp4',
];

/**
 * 测试用音频文件
 *
 * 文件信息:
 * ```json
 * ```
 */
export const TEST_AUDIOS = [
  /**
   * 测试用音频1
   * 文件信息:
   * {
   *     "streams": [
   *         {
   *             "index": 0,
   *             "codec_name": "mp3",
   *             "codec_long_name": "MP3 (MPEG audio layer 3)",
   *             "codec_type": "audio",
   *             "codec_tag_string": "[0][0][0][0]",
   *             "codec_tag": "0x0000",
   *             "sample_fmt": "fltp",
   *             "sample_rate": "32000",
   *             "channels": 1,
   *             "channel_layout": "mono",
   *             "bits_per_sample": 0,
   *             "initial_padding": 0,
   *             "r_frame_rate": "0/0",
   *             "avg_frame_rate": "0/0",
   *             "time_base": "1/14112000",
   *             "start_pts": 487305,
   *             "start_time": "0.034531",
   *             "duration_ts": 149361408,
   *             "duration": "10.584000",
   *             "bit_rate": "128000",
   *             "disposition": {
   *                 "default": 0,
   *                 "dub": 0,
   *                 "original": 0,
   *                 "comment": 0,
   *                 "lyrics": 0,
   *                 "karaoke": 0,
   *                 "forced": 0,
   *                 "hearing_impaired": 0,
   *                 "visual_impaired": 0,
   *                 "clean_effects": 0,
   *                 "attached_pic": 0,
   *                 "timed_thumbnails": 0,
   *                 "non_diegetic": 0,
   *                 "captions": 0,
   *                 "descriptions": 0,
   *                 "metadata": 0,
   *                 "dependent": 0,
   *                 "still_image": 0,
   *                 "multilayer": 0
   *             }
   *         }
   *     ],
   *     "format": {
   *         "filename": "audio_1.mp3",
   *         "nb_streams": 1,
   *         "nb_programs": 0,
   *         "nb_stream_groups": 0,
   *         "format_name": "mp3",
   *         "format_long_name": "MP2/3 (MPEG audio layer 2/3)",
   *         "start_time": "0.034531",
   *         "duration": "10.584000",
   *         "size": "171277",
   *         "bit_rate": "129461",
   *         "probe_score": 51,
   *         "tags": {
   *             "encoder": "Lavf58.76.100",
   *             "aigc": "{\"aigc\": {\"Label\": \"1\", \"ContentProducer\": \"HUABABSpeech7E01\", \"ProduceID\": \"05fd968ccfc6257744c7f1c2142a8fb3\"}}"
   *         }
   *     }
   * }
   */
  'http://10.50.2.35:9001/test/media_test_asset/audio_1.mp3',

  /**
   * 测试用音频2
   * 文件信息:
   * {
   *     "streams": [
   *         {
   *             "index": 0,
   *             "codec_name": "opus",
   *             "codec_long_name": "Opus (Opus Interactive Audio Codec)",
   *             "codec_type": "audio",
   *             "codec_tag_string": "[0][0][0][0]",
   *             "codec_tag": "0x0000",
   *             "sample_fmt": "fltp",
   *             "sample_rate": "48000",
   *             "channels": 2,
   *             "channel_layout": "stereo",
   *             "bits_per_sample": 0,
   *             "initial_padding": 312,
   *             "r_frame_rate": "0/0",
   *             "avg_frame_rate": "0/0",
   *             "time_base": "1/48000",
   *             "start_pts": 0,
   *             "start_time": "0.000000",
   *             "duration_ts": 6842722,
   *             "duration": "142.556708",
   *             "extradata_size": 19,
   *             "disposition": {
   *                 "default": 0,
   *                 "dub": 0,
   *                 "original": 0,
   *                 "comment": 0,
   *                 "lyrics": 0,
   *                 "karaoke": 0,
   *                 "forced": 0,
   *                 "hearing_impaired": 0,
   *                 "visual_impaired": 0,
   *                 "clean_effects": 0,
   *                 "attached_pic": 0,
   *                 "timed_thumbnails": 0,
   *                 "non_diegetic": 0,
   *                 "captions": 0,
   *                 "descriptions": 0,
   *                 "metadata": 0,
   *                 "dependent": 0,
   *                 "still_image": 0,
   *                 "multilayer": 0
   *             },
   *             "tags": {
   *                 "encoder": "Lavc61.19.101 libopus",
   *                 "album": "英雄伝説 閃の軌跡",
   *                 "artist": "小寺可南子",
   *                 "genre": "Game",
   *                 "title": "明日への鼓動 -Opening size-",
   *                 "track": "2",
   *                 "album_artist": "Falcom Sound Team jdk",
   *                 "composer": "Falcom Sound Team jdk",
   *                 "date": "2013"
   *             }
   *         }
   *     ],
   *     "format": {
   *         "filename": "audio_2.opus",
   *         "nb_streams": 1,
   *         "nb_programs": 0,
   *         "nb_stream_groups": 0,
   *         "format_name": "ogg",
   *         "format_long_name": "Ogg",
   *         "start_time": "0.000000",
   *         "duration": "142.556708",
   *         "size": "1668130",
   *         "bit_rate": "93612",
   *         "probe_score": 100
   *     }
   * }
   */
  'http://10.50.2.35:9001/test/media_test_asset/audio_2.opus',
];

/**
 * 测试用图片文件
 *
 * 文件信息:
 * ```json
 * ```
 */
export const TEST_IMAGES = [
  /**
   * 测试用图片1
   * 文件信息:
   * {
   *     "streams": [
   *         {
   *             "index": 0,
   *             "codec_name": "mjpeg",
   *             "codec_long_name": "Motion JPEG",
   *             "profile": "Baseline",
   *             "codec_type": "video",
   *             "codec_tag_string": "[0][0][0][0]",
   *             "codec_tag": "0x0000",
   *             "width": 896,
   *             "height": 1200,
   *             "coded_width": 896,
   *             "coded_height": 1200,
   *             "closed_captions": 0,
   *             "film_grain": 0,
   *             "has_b_frames": 0,
   *             "sample_aspect_ratio": "1:1",
   *             "display_aspect_ratio": "56:75",
   *             "pix_fmt": "yuvj420p",
   *             "level": -99,
   *             "color_range": "pc",
   *             "color_space": "bt470bg",
   *             "chroma_location": "center",
   *             "refs": 1,
   *             "r_frame_rate": "25/1",
   *             "avg_frame_rate": "25/1",
   *             "time_base": "1/25",
   *             "start_pts": 0,
   *             "start_time": "0.000000",
   *             "duration_ts": 1,
   *             "duration": "0.040000",
   *             "bits_per_raw_sample": "8",
   *             "disposition": {
   *                 "default": 0,
   *                 "dub": 0,
   *                 "original": 0,
   *                 "comment": 0,
   *                 "lyrics": 0,
   *                 "karaoke": 0,
   *                 "forced": 0,
   *                 "hearing_impaired": 0,
   *                 "visual_impaired": 0,
   *                 "clean_effects": 0,
   *                 "attached_pic": 0,
   *                 "timed_thumbnails": 0,
   *                 "non_diegetic": 0,
   *                 "captions": 0,
   *                 "descriptions": 0,
   *                 "metadata": 0,
   *                 "dependent": 0,
   *                 "still_image": 0,
   *                 "multilayer": 0
   *             }
   *         }
   *     ],
   *     "format": {
   *         "filename": "image_1.jpg",
   *         "nb_streams": 1,
   *         "nb_programs": 0,
   *         "nb_stream_groups": 0,
   *         "format_name": "image2",
   *         "format_long_name": "image2 sequence",
   *         "start_time": "0.000000",
   *         "duration": "0.040000",
   *         "size": "737913",
   *         "bit_rate": "147582600",
   *         "probe_score": 50
   *     }
   * }
   */
  'http://10.50.2.35:9001/test/media_test_asset/image_1.jpg',

  /**
   * 测试用图片2
   * 文件信息:
   * {
   *     "streams": [
   *         {
   *             "index": 0,
   *             "codec_name": "png",
   *             "codec_long_name": "PNG (Portable Network Graphics) image",
   *             "codec_type": "video",
   *             "codec_tag_string": "[0][0][0][0]",
   *             "codec_tag": "0x0000",
   *             "width": 1456,
   *             "height": 816,
   *             "coded_width": 1456,
   *             "coded_height": 816,
   *             "closed_captions": 0,
   *             "film_grain": 0,
   *             "has_b_frames": 0,
   *             "pix_fmt": "rgb24",
   *             "level": -99,
   *             "color_range": "pc",
   *             "color_space": "gbr",
   *             "color_transfer": "iec61966-2-1",
   *             "color_primaries": "bt709",
   *             "refs": 1,
   *             "r_frame_rate": "25/1",
   *             "avg_frame_rate": "25/1",
   *             "time_base": "1/25",
   *             "disposition": {
   *                 "default": 0,
   *                 "dub": 0,
   *                 "original": 0,
   *                 "comment": 0,
   *                 "lyrics": 0,
   *                 "karaoke": 0,
   *                 "forced": 0,
   *                 "hearing_impaired": 0,
   *                 "visual_impaired": 0,
   *                 "clean_effects": 0,
   *                 "attached_pic": 0,
   *                 "timed_thumbnails": 0,
   *                 "non_diegetic": 0,
   *                 "captions": 0,
   *                 "descriptions": 0,
   *                 "metadata": 0,
   *                 "dependent": 0,
   *                 "still_image": 0,
   *                 "multilayer": 0
   *             }
   *         }
   *     ],
   *     "format": {
   *         "filename": "image_2.png",
   *         "nb_streams": 1,
   *         "nb_programs": 0,
   *         "nb_stream_groups": 0,
   *         "format_name": "png_pipe",
   *         "format_long_name": "piped png sequence",
   *         "size": "1951177",
   *         "probe_score": 99
   *     }
   * }
   */
  'http://10.50.2.35:9001/test/media_test_asset/image_2.png',
];

/**
 * 测试用字幕文件
 *
 * 文件信息:
 * ```json
 * ```
 */
export const TEST_SUBTITLES = [
  /**
   * 测试用字幕1
   * 文件信息:
   * {
   *     "streams": [
   *         {
   *             "index": 0,
   *             "codec_name": "subrip",
   *             "codec_long_name": "SubRip subtitle",
   *             "codec_type": "subtitle",
   *             "codec_tag_string": "[0][0][0][0]",
   *             "codec_tag": "0x0000",
   *             "r_frame_rate": "0/0",
   *             "avg_frame_rate": "0/0",
   *             "time_base": "1/1000",
   *             "disposition": {
   *                 "default": 0,
   *                 "dub": 0,
   *                 "original": 0,
   *                 "comment": 0,
   *                 "lyrics": 0,
   *                 "karaoke": 0,
   *                 "forced": 0,
   *                 "hearing_impaired": 0,
   *                 "visual_impaired": 0,
   *                 "clean_effects": 0,
   *                 "attached_pic": 0,
   *                 "timed_thumbnails": 0,
   *                 "non_diegetic": 0,
   *                 "captions": 0,
   *                 "descriptions": 0,
   *                 "metadata": 0,
   *                 "dependent": 0,
   *                 "still_image": 0,
   *                 "multilayer": 0
   *             }
   *         }
   *     ],
   *     "format": {
   *         "filename": "subtitle_1.srt",
   *         "nb_streams": 1,
   *         "nb_programs": 0,
   *         "nb_stream_groups": 0,
   *         "format_name": "srt",
   *         "format_long_name": "SubRip subtitle",
   *         "size": "2391",
   *         "probe_score": 100
   *     }
   * }
   */
  'http://10.50.2.35:9001/test/media_test_asset/subtitle_1.srt',

  /**
   * 测试用字幕2
   * 文件信息:
   * {
   *     "streams": [
   *         {
   *             "index": 0,
   *             "codec_name": "ass",
   *             "codec_long_name": "ASS (Advanced SSA) subtitle",
   *             "codec_type": "subtitle",
   *             "codec_tag_string": "[0][0][0][0]",
   *             "codec_tag": "0x0000",
   *             "r_frame_rate": "0/0",
   *             "avg_frame_rate": "0/0",
   *             "time_base": "1/100",
   *             "extradata_size": 585,
   *             "disposition": {
   *                 "default": 0,
   *                 "dub": 0,
   *                 "original": 0,
   *                 "comment": 0,
   *                 "lyrics": 0,
   *                 "karaoke": 0,
   *                 "forced": 0,
   *                 "hearing_impaired": 0,
   *                 "visual_impaired": 0,
   *                 "clean_effects": 0,
   *                 "attached_pic": 0,
   *                 "timed_thumbnails": 0,
   *                 "non_diegetic": 0,
   *                 "captions": 0,
   *                 "descriptions": 0,
   *                 "metadata": 0,
   *                 "dependent": 0,
   *                 "still_image": 0,
   *                 "multilayer": 0
   *             }
   *         }
   *     ],
   *     "format": {
   *         "filename": "subtitle_2.ass",
   *         "nb_streams": 1,
   *         "nb_programs": 0,
   *         "nb_stream_groups": 0,
   *         "format_name": "ass",
   *         "format_long_name": "SSA (SubStation Alpha) subtitle",
   *         "size": "5734",
   *         "probe_score": 100
   *     }
   * }
   */
  'http://10.50.2.35:9001/test/media_test_asset/subtitle_2.ass',
];
// #endregion

// #region 测试辅助工具
/**
 * 媒体模块测试辅助工具类
 *
 * 提供测试资产的本地下载与清理能力: 本地文件读取类测试用例使用下载到本地的测试资产文件进行, 测试结束后清理下载文件
 */
export class MediaTestUtil {
  /**
   * 下载测试资产文件到本地临时目录
   *
   * @param url 测试资产的下载地址
   * @return 下载到本地的文件绝对路径
   */
  static async downloadTestAsset(url: string): Promise<string> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`下载测试资产失败: status = ${response.status}, url = ${url}`);
    }
    const filepath = join(tmpdir(), `${randomUUID()}${extname(new URL(url).pathname)}`);
    await writeFile(filepath, Buffer.from(await response.arrayBuffer()));
    return filepath;
  }

  /**
   * 清理下载到本地的测试资产文件
   *
   * @param filepaths 下载到本地的文件路径列表
   */
  static async removeLocalTestFiles(...filepaths: Array<string>): Promise<void> {
    await Promise.all(filepaths.map((filepath) => rm(filepath, { force: true })));
  }
}
// #endregion

describe(basename(__filename), () => {
  it('constructor()', async () => {
    const mediaModule = await Test.createTestingModule({
      imports: [ConfigurationModule, MediaModule, LoggerModule, ContextModule, InternationalizationModule],
    }).compile();
    expect(mediaModule);
  });
});
