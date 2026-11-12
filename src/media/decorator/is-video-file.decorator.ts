import { registerDecorator, ValidationOptions } from 'class-validator';
import { IsVideoFileValidator } from '../validator/is-video-file.validator';

export const IsVideoFile = (options?: ValidationOptions) => (dto: Object, propertyName: string) =>
  registerDecorator({
    target: dto.constructor,
    propertyName,
    options,
    validator: IsVideoFileValidator,
  });
