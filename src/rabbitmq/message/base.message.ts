import { isEmpty, isNil } from 'lodash';
import { plainToInstance } from 'class-transformer';
import { MessageDeserializationException } from '../exception/message-deserialization.exception';

/**
 * Rabbitmq队列消息基类
 */
export class BaseMessage<P extends string, D> {
  constructor(
    public readonly requestId: string,
    public readonly pattern: P,
    public readonly data?: D,
  ) {}

  toString() {
    return JSON.stringify({ pattern: this.pattern, data: this.data, requestId: this.requestId });
  }

  public static fromString<E extends string, D>(jsonString: string): BaseMessage<E, D> {
    try {
      const jsonData = JSON.parse(jsonString);
      return BaseMessage.fromObject<E, D>(jsonData);
    } catch (error) {
      let errorMsg = '队列消息反序列化失败';
      if (error instanceof MessageDeserializationException) {
        errorMsg += `: ${error.message}`;
      }
      throw new MessageDeserializationException(new Error(errorMsg));
    }
  }

  public static fromObject<E extends string, D>(input: unknown): BaseMessage<E, D> {
    try {
      const message = plainToInstance<BaseMessage<E, D>, unknown>(BaseMessage, input);
      if (isNil(message.requestId) || isEmpty(message.requestId)) {
        throw new MessageDeserializationException(new Error('requestId缺失'));
      }
      if (isNil(message.pattern) || isEmpty(message.pattern)) {
        throw new MessageDeserializationException(new Error('pattern缺失'));
      }
      return message;
    } catch (error) {
      let errorMsg = '队列消息反序列化失败';
      if (error instanceof MessageDeserializationException) {
        errorMsg += `: ${error.message}`;
      }
      throw new MessageDeserializationException(new Error(errorMsg));
    }
  }
}
