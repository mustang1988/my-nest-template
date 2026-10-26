import { PipeTransform } from '@nestjs/common';
import { BaseMessage } from '../message/base.message';
import { MessageDeserializationException } from '../exception/message-deserialization.exception';

/**
 * 消息类型静态工厂
 *
 * 仅要求消息类型提供反序列化静态方法, 不约束其构造函数签名
 */
type IMessageFactory = Pick<typeof BaseMessage, 'fromString' | 'fromObject'>;

/**
 * Rabbitmq队列消息转换管道
 *
 * 将队列消息内容反序列化为指定的消息类型实例
 */
export class RabbitmqMessagePipe implements PipeTransform {
  constructor(private readonly messageCtor: IMessageFactory) {}

  transform(value: unknown) {
    if (value instanceof BaseMessage) {
      return value;
    }
    try {
      /**
       * 队列消息格式为字符串
       */
      if (typeof value === 'string') {
        return this.messageCtor.fromString(value);
      }

      /**
       * 队列消息格式为对象
       */
      if (typeof value === 'object') {
        return this.messageCtor.fromObject(value);
      }
    } catch (error) {
      throw new MessageDeserializationException(error);
    }

    throw new MessageDeserializationException(new Error('不支持的消息内容'));
  }
}
