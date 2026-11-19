import { HttpExceptionOptions, InternalServerErrorException } from '@nestjs/common';

/**
 * 队列消息反序列化异常
 */
export class MessageDeserializationException extends InternalServerErrorException {
  constructor(objectOrError?: any, descriptionOrOptions?: string | HttpExceptionOptions) {
    super(objectOrError, descriptionOrOptions);
  }
}
