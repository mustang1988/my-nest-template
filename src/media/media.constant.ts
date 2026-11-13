import ms from 'ms';
import bytes from 'bytes';
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
}

/**
 * execFile()函数Promise包装
 */
export const execFileAsync = promisify(execFile);

/**
 * ffprobe单次执行的超时时长(毫秒)
 *
 * 超时后子进程被终止并抛出异常, 避免不可达的URL输入等场景长时间占用请求
 */
export const FFPROBE_TIMEOUT_MS = ms('30s');

/**
 * ffprobe执行输出缓冲区上限(字节)
 *
 * bytes()解析失败时返回null, 此处以兜底值收窄类型(字面量'10MB'实际不会解析失败)
 */
export const FFPROBE_MAX_BUFFER = bytes('10MB') ?? 10 * 1024 * 1024;

/**
 * 媒体探测结果缓存容量上限(条)
 *
 * 同一输入的重复探测直接复用缓存结果(如同一DTO属性挂多个媒体校验器时), 避免重复执行ffprobe;
 * URL输入时尤为昂贵, 每次探测都会重新下载媒体文件
 */
export const MEDIA_CACHE_MAX_SIZE = 100;
