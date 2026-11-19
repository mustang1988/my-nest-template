import { IsVideoValidator } from '../validator/is-video.validator';
import { registerDecorator, ValidationOptions } from 'class-validator';

/**
 * 属性值对应媒体是否为视频媒体校验器对应装饰器
 * @param options 校验选项
 */
export const IsVideo = (options?: ValidationOptions) => (dto: object, propertyName: string) =>
  registerDecorator({ target: dto.constructor, propertyName, options, validator: IsVideoValidator });
