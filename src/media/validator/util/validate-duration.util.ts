import { compact, isEmpty } from 'lodash';
import { ECodecType } from '../../media.constant';
import { IMedia } from '../../interface/media.interface';
import { IMediaAudioStream } from '../../interface/media-audio-stream.interface';
import { IMediaVideoStream } from '../../interface/media-video-stream.interface';

/**
 * 待校验时长选取工具类
 */
export class ValidateDurationUtil {
  /**
   * 获取待校验的时长列表
   * @param media 媒体信息
   * @param codecType 流类型
   * @param streamIndex 流索引
   * @return 待校验的时长列表(单位: 秒); 指定类型的流不存在或待校验流的流级时长未知(ffprobe输出"N/A")时返回undefined
   */
  static getDurations(media: IMedia, codecType?: ECodecType, streamIndex?: number): Array<number> | undefined {
    if (streamIndex !== undefined && streamIndex < 0) {
      // 流索引不可以小于0
      return undefined;
    }

    /**
     * 未指定流类型: 取媒体整体时长
     */
    if (codecType === undefined) {
      const duration = media.getDuration();
      return duration === undefined ? undefined : [duration];
    }

    /**
     * 指定流类型: 取对应流的流级时长
     */
    let streams: Array<IMediaAudioStream | IMediaVideoStream> = [];
    switch (codecType) {
      case ECodecType.AUDIO:
        streams = streamIndex !== undefined ? [media.getAudioStream(streamIndex) as IMediaAudioStream] : media.getAudioStreams();
        break;
      case ECodecType.VIDEO:
        streams = streamIndex !== undefined ? [media.getVideoStream(streamIndex) as IMediaVideoStream] : media.getVideoStreams();
        break;
      default:
        return undefined;
    }
    streams = compact(streams);
    if (isEmpty(streams)) {
      // 指定类型的流不存在
      return undefined;
    }
    const durations = streams.map((stream) => stream.duration);
    if (durations.some((duration) => duration === undefined || Number.isNaN(duration))) {
      // 任一待校验流的流级时长未知时无法确认校验结果
      return undefined;
    }
    return durations as Array<number>;
  }
}
