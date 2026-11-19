import { compact } from 'lodash';
import { IMedia } from '../../interface/media.interface';
import { IDimension } from '../../interface/dimension.interface';
import { IMediaVideoStream } from '../../interface/media-video-stream.interface';

/**
 * 待校验画面尺寸选取工具类
 */
export class ValidateDimensionUtil {
  /**
   * 获取待校验的画面尺寸列表
   *
   * @param media 媒体信息
   * @param streamIndex 流索引
   * @return 待校验的画面尺寸列表; 指定的流不存在(纯音频/字幕媒体无视频流)或任一待校验流的画面宽高未知/非法时返回undefined
   */
  static getDimensions(media: IMedia, streamIndex?: number): Array<IDimension> | undefined {
    if (streamIndex !== undefined && streamIndex < 0) {
      return undefined;
    }

    const videoStreams = compact(streamIndex !== undefined ? [media.getVideoStream(streamIndex) as IMediaVideoStream] : media.getVideoStreams());
    if (videoStreams.length === 0) {
      return undefined;
    }

    const dimensions = videoStreams.map((videoStream) => {
      if (!videoStream.width || !videoStream.height || videoStream.width <= 0 || videoStream.height <= 0) {
        return undefined;
      }
      return { width: videoStream.width, height: videoStream.height };
    });

    if (dimensions.some((dimension) => dimension === undefined)) {
      return undefined;
    }

    return dimensions as Array<IDimension>;
  }
}
