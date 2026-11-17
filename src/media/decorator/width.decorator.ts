import { WidthValidator } from '../validator/width.validator';
import { registerDecorator, ValidationOptions } from 'class-validator';

/**
 * 画面宽度范围校验器装饰器
 *
 * 适用于以下类型的媒体
 * - 视频
 * - 图片
 *
 * @param minWidthInPixel 最小宽度, 单位: px
 * @param maxWidthInPixel 最大宽度, 单位: px
 * @param options 校验选项
 */
export const Width = (minWidthInPixel: number, maxWidthInPixel: number, options?: ValidationOptions) => (dto: object, propertyName: string) =>
  registerDecorator({ target: dto.constructor, propertyName, options, constraints: [minWidthInPixel, maxWidthInPixel], validator: WidthValidator });
