import { PipeTransform } from '@nestjs/common';
import { BaseMessage } from '../message/base.message';
import { SampleMessage } from 'src/sample/message/sample.message';
import { MessageDeserializationException } from '../exception/message-deserialization.exception';

/**
 * Rabbitmq队列消息转换管道
 */
export class RabbitmqMessagePipe implements PipeTransform {
  transform(value: unknown) {
    if (value instanceof BaseMessage) {
      return value;
    }
    try {
      /**
       * 队列消息格式为字符串
       */
      if (typeof value === 'string') {
        return SampleMessage.fromString(value);
      }

      /**
       * 队列消息格式为对象
       */
      if (typeof value === 'object') {
        return SampleMessage.fromObject(value);
      }
    } catch (error) {
      throw new MessageDeserializationException(error);
    }

    throw new MessageDeserializationException(new Error('不支持的消息内容'));
  }
}
