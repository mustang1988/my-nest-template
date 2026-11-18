/**
 * 画面尺寸
 *
 * 适用于以下类型媒体
 * - 图片
 * - 视频
 */
export interface IDimension {
  /**
   * 画面宽度
   *
   * - 单位: px
   */
  width: number;

  /**
   * 画面高度
   *
   * - 单位: px
   */
  height: number;
}
