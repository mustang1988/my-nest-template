/**
 * 图片扩展选项
 */
export interface IImageExtendOptions {
  /**
   * 上部扩展像素数
   */
  top?: number;

  /**
   * 左侧扩展像素数
   */
  left?: number;

  /**
   * 底部扩展像素数
   */
  bottom?: number;

  /**
   * 右侧扩展像素数
   */
  right?: number;

  /**
   * 扩展方式
   */
  extendWith?: 'background' | 'copy' | 'repeat' | 'mirror';

  /**
   * 扩展填充背景色
   */
  background?: { r: number; g: number; b: number; alpha: number };
}
