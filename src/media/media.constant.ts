import { promisify } from 'node:util';
import { execFile } from 'node:child_process';

/**
 * 图片媒体封装格式分流器
 *
 * ffprobe读取到的format.format_name值若在此列表中, 标明读取到的codec_type=video的流为图片内容非视频内容
 */
export const IMAGE_DEMUXER = ['png_pipe', 'jpeg_pipe', 'webp_pipe', 'image2', 'gif', 'bmp_pipe', 'tiff_pipe', 'svg_pipe'];

/**
 * 媒体编码类型枚举
 */
export enum ECodecType {
  /**
   * 音频流
   */
  AUDIO = 'audio',

  /**
   * 视频流
   */
  VIDEO = 'video',

  /**
   * 字幕流
   */
  SUBTITLE = 'subtitle',
}

/**
 * execFile()函数Promise包装
 */
export const execFileAsync = promisify(execFile);

/**
 * 媒体信息缓存IoC注入Token
 */
export const MEDIA_CACHE_TOKEN: unique symbol = Symbol('token:media-cache');
