import { registerDecorator, ValidationOptions } from 'class-validator';
import { IsSubtitleValidator } from '../validator/is-subtitle.validator';

/**
 * 属性值对应媒体是否为字幕媒体校验器对应装饰器
 * @param options 校验选项
 */
export const IsSubtitle = (options?: ValidationOptions) => (dto: object, propertyName: string) =>
  registerDecorator({ target: dto.constructor, propertyName, options, validator: IsSubtitleValidator });
