import { compact } from 'lodash';
import { IMedia } from '../../interface/media.interface';
import { IMediaVideoStream } from '../../interface/media-video-stream.interface';

/**
 * 待校验帧率选取工具类
 */
export class ValidateFpsUtil {
  /**
   * 获取待校验的视频帧率列表
   *
   * @param media 媒体信息
   * @param streamIndex 流索引
   * @return 待校验的帧率列表(单位: 帧/秒); 指定的流不存在、任一待校验流的帧率未知或媒体为图片媒体时返回undefined
   */
  static getFpsList(media: IMedia, streamIndex?: number): Array<number> | undefined {
    /**
     * 图片媒体不参与帧率校验: 图片流的r_frame_rate为图片分流器的默认值(如25/1)而非真实帧率
     */
    if (media.isImageMedia()) {
      return undefined;
    }

    if (streamIndex !== undefined && streamIndex < 0) {
      // 流索引不可以小于0
      return undefined;
    }

    const videoStreams = compact(streamIndex !== undefined ? [media.getVideoStream(streamIndex) as IMediaVideoStream] : media.getVideoStreams());
    if (videoStreams.length === 0) {
      // 无视频流(纯音频媒体无帧率)
      return undefined;
    }
    const fpsList = videoStreams.map((videoStream) => {
      /**
       * 优先取基准帧率, 基准帧率未知(ffprobe输出"0/0")时回退取平均帧率
       */
      return ValidateFpsUtil.parseFrameRate(videoStream.r_frame_rate) ?? ValidateFpsUtil.parseFrameRate(videoStream.avg_frame_rate);
    });
    if (fpsList.some((fps) => fps === undefined || Number.isNaN(fps))) {
      // 任一待校验流的帧率未知时无法确认校验结果
      return undefined;
    }
    return fpsList as Array<number>;
  }

  /**
   * 解析ffprobe输出的帧率字符串为帧率数值
   *
   * @param frameRate 帧率字符串, ffprobe输出为分数格式(如"60000/1001"), 未知时输出"0/0"
   * @return 帧率(单位: 帧/秒); 无法解析或未知时返回undefined
   */
  private static parseFrameRate(frameRate: string | undefined): number | undefined {
    if (!frameRate) {
      return undefined;
    }
    const [numerator, denominator] = frameRate.split('/').map(Number);
    if (numerator === undefined || denominator === undefined || Number.isNaN(numerator) || Number.isNaN(denominator) || denominator <= 0) {
      return undefined;
    }
    const fps = numerator / denominator;
    return Number.isFinite(fps) && fps > 0 ? fps : undefined;
  }
}
