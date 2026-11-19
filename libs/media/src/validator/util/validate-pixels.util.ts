import { compact } from 'lodash';
import { IMedia } from '../../interface/media.interface';
import { IMediaVideoStream } from '../../interface/media-video-stream.interface';

/**
 * 待校验画面总像素数选取工具类
 */
export class ValidatePixelsUtil {
  /**
   * 获取待校验的画面总像素数列表
   * @param media 媒体信息
   * @param streamIndex 流索引
   * @return 待校验的总像素数列表; 指定的流不存在(纯音频媒体无视频流)或任一待校验流的画面宽高未知/非法时返回undefined
   */
  static getPixels(media: IMedia, streamIndex?: number): Array<number> | undefined {
    if (streamIndex !== undefined && streamIndex < 0) {
      return undefined;
    }

    const videoStreams = compact(streamIndex !== undefined ? [media.getVideoStream(streamIndex) as IMediaVideoStream] : media.getVideoStreams());
    if (videoStreams.length === 0) {
      return undefined;
    }

    const pixels = videoStreams.map((videoStream) => {
      if (!videoStream.width || !videoStream.height || videoStream.width <= 0 || videoStream.height <= 0) {
        return undefined;
      }
      return videoStream.width * videoStream.height;
    });

    if (pixels.some((pixel) => pixel === undefined || Number.isNaN(pixel))) {
      return undefined;
    }

    return pixels as Array<number>;
  }
}
