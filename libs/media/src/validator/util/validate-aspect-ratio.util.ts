import { compact } from 'lodash';
import { IMedia } from '../../interface/media.interface';
import { IMediaVideoStream } from '../../interface/media-video-stream.interface';

/**
 * 待校验宽高比选取工具类
 */
export class ValidateAspectRatioUtil {
  /**
   * 获取待校验的画面宽高比列表
   *
   * @param media 媒体信息
   * @param streamIndex 流索引
   * @return 待校验的宽高比列表; 指定的流不存在(纯音频媒体无视频流)或任一待校验流的画面宽高未知/非法时返回undefined
   */
  static getAspectRatios(media: IMedia, streamIndex?: number): Array<number> | undefined {
    if (streamIndex !== undefined && streamIndex < 0) {
      return undefined;
    }

    const videoStreams = compact(streamIndex !== undefined ? [media.getVideoStream(streamIndex) as IMediaVideoStream] : media.getVideoStreams());
    if (videoStreams.length === 0) {
      return undefined;
    }

    const ratios = videoStreams.map((videoStream) => {
      if (!videoStream.width || !videoStream.height || videoStream.width <= 0 || videoStream.height <= 0) {
        return undefined;
      }
      return videoStream.width / videoStream.height;
    });

    if (ratios.some((ratio) => ratio === undefined || Number.isNaN(ratio))) {
      return undefined;
    }

    return ratios as Array<number>;
  }
}
