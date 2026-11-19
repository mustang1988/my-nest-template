import { HttpExceptionOptions, InternalServerErrorException } from '@nestjs/common';

/**
 * 事件消息反序列化异常
 */
export class EventDeserializationException extends InternalServerErrorException {
  constructor(objectOrError?: any, descriptionOrOptions?: string | HttpExceptionOptions) {
    super(objectOrError, descriptionOrOptions);
  }
}
