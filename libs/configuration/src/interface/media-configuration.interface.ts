/**
 * 媒体模块配置
 */
export interface IMediaConfiguration {
  /**
   * 媒体信息读取超时时间
   *
   * 单位: 毫秒
   */
  timeout: number;

  /**
   * 媒体信息读取缓冲区上限
   *
   * 单位: 字节
   */
  maxBuffer: number;

  /**
   * 媒体信息缓存数量上限
   */
  maxSize: number;

  /**
   * 媒体信息缓存时长上限
   *
   * 单位: 毫秒
   */
  maxAge: number;
}
