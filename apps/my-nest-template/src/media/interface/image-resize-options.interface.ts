import { Color } from 'sharp';
import { ImageResizeFit } from '../type/image-resize-fit.type';

/**
 * 图片文件尺寸调整选项
 */
export interface IImageResizeOptions {
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

  /**
   * 适应方式
   */
  fit?: ImageResizeFit;

  /**
   * 适应区域填充背景色
   */
  background?: Color;
}
