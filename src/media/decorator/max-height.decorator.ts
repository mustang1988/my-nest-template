import { MaxHeightValidator } from '../validator/max-height.validator';
import { registerDecorator, ValidationOptions } from 'class-validator';

/**
 * 画面高度最大值校验器装饰器
 *
 * 适用范围
 * - 视频文件路径
 * - 视频URL
 * - 图片文件路径
 * - 图片URL
 *
 * @param maxHeightInPixel 最大高度, 单位: px
 * @param options 校验选项
 */
export const MaxHeight = (maxHeightInPixel: number, options?: ValidationOptions) => (dto: object, propertyName: string) =>
  registerDecorator({ target: dto.constructor, propertyName, options, constraints: [maxHeightInPixel], validator: MaxHeightValidator });
