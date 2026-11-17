import { MinWidthValidator } from '../validator/min-width.validator';
import { registerDecorator, ValidationOptions } from 'class-validator';

/**
 * 画面宽度最小值校验器装饰器
 *
 * 适用于以下类型的媒体
 * - 视频
 * - 图片
 *
 * @param minWidthInPixel 最小宽度, 单位: px
 * @param options 校验选项
 */
export const MinWidth = (minWidthInPixel: number, options?: ValidationOptions) => (dto: object, propertyName: string) =>
  registerDecorator({ target: dto.constructor, propertyName, options, constraints: [minWidthInPixel], validator: MinWidthValidator });
