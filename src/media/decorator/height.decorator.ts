import { HeightValidator } from '../validator/height.validator';
import { registerDecorator, ValidationOptions } from 'class-validator';

/**
 * 画面高度范围校验器装饰器
 *
 * 适用范围
 * - 视频文件路径
 * - 视频URL
 * - 图片文件路径
 * - 图片URL
 *
 * @param minHeightInPixel 最小高度, 单位: px
 * @param maxHeightInPixel 最大高度, 单位: px
 * @param options 校验选项
 */
export const Height = (minHeightInPixel: number, maxHeightInPixel: number, options?: ValidationOptions) => (dto: object, propertyName: string) =>
  registerDecorator({
    target: dto.constructor,
    propertyName,
    options,
    constraints: [minHeightInPixel, maxHeightInPixel],
    validator: HeightValidator,
  });
