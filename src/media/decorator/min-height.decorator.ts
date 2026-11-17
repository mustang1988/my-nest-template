import { MinHeightValidator } from '../validator/min-height.validator';
import { registerDecorator, ValidationOptions } from 'class-validator';

/**
 * 画面高度最小值校验器装饰器
 *
 * 适用于以下类型的媒体
 * - 视频
 * - 图片
 *
 * @param minHeightInPixel 最小高度, 单位: px
 * @param options 校验选项
 */
export const MinHeight = (minHeightInPixel: number, options?: ValidationOptions) => (dto: object, propertyName: string) =>
  registerDecorator({ target: dto.constructor, propertyName, options, constraints: [minHeightInPixel], validator: MinHeightValidator });
