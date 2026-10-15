import { get, isEmpty, isNil } from 'lodash';
import { EventType } from '../../event/type/event.type';

export class BaseMessage<P extends string, D> {
  private readonly requestId: string;
  private readonly pattern: P;
  private readonly data: D;

  constructor(requestId: string, pattern: P, data: D) {
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

  public getData(): D {
    return this.data;
  }

  public getDataWithRequestId(): D & { requestId: string } {
    return { ...this.data, requestId: this.requestId };
  }

  toJsonString() {
    return JSON.stringify({ pattern: this.pattern, data: this.getDataWithRequestId() });
  }

  public static fromJsonString<E extends string, T>(jsonString: string): BaseMessage<E, T> {
    try {
      const jsonData = JSON.parse(jsonString);
      const requestId = get(jsonData, 'requestId');
      const pattern = get(jsonData, 'pattern');
      const data = get(jsonData, 'data');
      if (isEmpty(requestId) || isEmpty(pattern) || isEmpty(data)) {
        throw new Error('队列消息反序列化失败');
      }
      return new BaseMessage(requestId, pattern, data);
    } catch (error) {
      throw new Error('队列消息反序列化失败');
    }
  }

  public static fromJsonObject<E extends string, T>(input: unknown): BaseMessage<E, T> {
    try {
      const requestId = get(input, 'requestId');
      const pattern = get(input, 'pattern');
      const data = get(input, 'data');
      if (isEmpty(requestId) || isNil(requestId) || isEmpty(pattern) || isNil(pattern) || isEmpty(data) || isNil(data)) {
        throw new Error('队列消息反序列化失败');
      }
      return new BaseMessage(requestId, pattern, data);
    } catch (error) {
      throw new Error('队列消息反序列化失败');
    }
  }
}
