import { PipeTransform } from '@nestjs/common';
import { SampleMessage } from '../message/sample.message';
import { MessageDeserializationException } from '../../rabbitmq/exception/message-deserialization.exception';

/**
 * 示例队列消息转换管道
 */
export class SampleMessagePipe implements PipeTransform {
  transform(value: unknown) {
    /**
     * 队列消息payload格式为字符串
     */
    if (typeof value === 'string') {
      return SampleMessage.fromString(value);
    }

    /**
     * 队列消息payload格式为对象
     */
    if (typeof value === 'object') {
      return SampleMessage.fromObject(value);
    }

    throw new MessageDeserializationException(new Error('未知消息类型'));
  }
}
