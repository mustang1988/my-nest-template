import { compact } from 'lodash';
import { IMedia } from '../../interface/media.interface';
import { IMediaVideoStream } from '../../interface/media-video-stream.interface';

/**
 * 待校验画面尺寸选取工具类
 */
export class ValidateDimensionUtil {
  /**
   * 获取待校验的画面尺寸列表
   *
   * - 未指定流索引时取所有视频流的画面尺寸
   * - 指定流索引时仅取对应流的画面尺寸(流索引非ffprobe的全局流索引, 为视频流中的第N个)
   *
   * @param media 媒体信息
   * @param streamIndex 流索引
   * @return 待校验的画面尺寸列表; 指定的流不存在(纯音频/字幕媒体无视频流)或任一待校验流的画面宽高未知/非法时返回undefined
   */
  static getDimensions(media: IMedia, streamIndex?: number): Array<{ width: number; height: number }> | undefined {
    if (streamIndex !== undefined && streamIndex < 0) {
      // 流索引不可以小于0
      return undefined;
    }

    const videoStreams = compact(streamIndex !== undefined ? [media.getVideoStream(streamIndex) as IMediaVideoStream] : media.getVideoStreams());
    if (videoStreams.length === 0) {
      // 无视频流(纯音频/字幕媒体无画面)
      return undefined;
    }
    const dimensions = videoStreams.map((videoStream) => {
      if (!videoStream.width || !videoStream.height || videoStream.width <= 0 || videoStream.height <= 0) {
        return undefined;
      }
      return { width: videoStream.width, height: videoStream.height };
    });
    if (dimensions.some((dimension) => dimension === undefined)) {
      // 任一待校验流的画面宽高未知或非法时无法确认校验结果
      return undefined;
    }
    return dimensions as Array<{ width: number; height: number }>;
  }
}
