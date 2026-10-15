import { get, isEmpty, isNil } from 'lodash';
import { MessageDeserializationException } from '../exception/message-deserialization.exception';

/**
 * Rabbitmq队列消息基类
 */
export class BaseMessage<P extends string, D> {
  /**
   * 触发队列消息发送的请求ID
   */
  private readonly requestId: string;

  /**
   * 队列消息pattern
   */
  private readonly pattern: P;

  /**
   * 队列消息负载内容
   */
  private readonly data: D | undefined;

  constructor(requestId: string, pattern: P, data?: D) {
    this.requestId = requestId;
    this.pattern = pattern;
    this.data = data;
  }

  public getRequestId(): string {
    return this.requestId;
  }

  public getPattern(): P {
    return this.pattern;
  }

  public getData(): D | undefined {
    return this.data;
  }

  public getDataWithRequestId(): { requestId: string } | (D & { requestId: string }) {
    return { ...this.data, requestId: this.requestId };
  }

  toJsonString() {
    return JSON.stringify({ pattern: this.pattern, data: this.getDataWithRequestId() });
  }

  public static fromJsonString<E extends string, D>(jsonString: string): BaseMessage<E, D> {
    try {
      const jsonData = JSON.parse(jsonString);
      const requestId: string = get(jsonData, 'requestId', get(jsonData, 'data.requestId'));
      const pattern: E = get(jsonData, 'pattern');
      const data: D | undefined = get(jsonData, 'data');
      if (isNil(requestId) || isEmpty(requestId)) {
        throw new MessageDeserializationException(new Error('requestId缺失'));
      }

      if (isNil(pattern) || isEmpty(pattern)) {
        throw new MessageDeserializationException(new Error('pattern缺失'));
      }
      return new BaseMessage<E, D>(requestId, pattern, data);
    } catch (error) {
      let errorMsg = '队列消息反序列化失败';
      if (error instanceof MessageDeserializationException) {
        errorMsg += `: ${error.message}`;
      }
      throw new Error(errorMsg);
    }
  }

  public static fromObject<E extends string, D>(input: unknown): BaseMessage<E, D> {
    try {
      const requestId = get(input, 'requestId');
      const pattern = get(input, 'pattern');
      const data = get(input, 'data');
      if (isNil(requestId) || isEmpty(requestId)) {
        throw new MessageDeserializationException(new Error('requestId缺失'));
      }

      if (isNil(pattern) || isEmpty(pattern)) {
        throw new MessageDeserializationException(new Error('pattern缺失'));
      }
      return new BaseMessage<E, D>(requestId, pattern, data);
    } catch (error) {
      let errorMsg = '队列消息反序列化失败';
      if (error instanceof MessageDeserializationException) {
        errorMsg += `: ${error.message}`;
      }
      throw new Error(errorMsg);
    }
  }
}
