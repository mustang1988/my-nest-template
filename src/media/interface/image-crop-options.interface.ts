/**
 * 图片文件裁切选项
 */
export interface IImageCropOptions {
  /**
   * 裁切起始点水平偏移量
   *
   * 单位: px
   */
  left: number;

  /**
   * 裁切起始点垂直偏移量
   *
   * 单位: px
   */
  top: number;

  /**
   * 目标宽度
   *
   * 单位: px
   */
  width: number;

  /**
   * 目标高度
   *
   * 单位: px
   */
  height: number;
}
