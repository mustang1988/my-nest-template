/**
 * 图片媒体封装格式分流器
 *
 * ffprobe读取到的format.format_name值若在此列表中, 标明读取到的codec_type=video的流为图片内容非视频内容
 */
export const IMAGE_DEMUXER = ['png_pipe', 'jpeg_pipe', 'webp_pipe', 'image2', 'gif', 'bmp_pipe', 'tiff_pipe', 'svg_pipe'];

/**
 * 媒体信息缓存IoC注入Token
 */
export const MEDIA_CACHE_TOKEN: unique symbol = Symbol('token:media-cache');
