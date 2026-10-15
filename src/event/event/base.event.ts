import { get, isEmpty, isNil } from 'lodash';
import { EventType } from '../type/event.type';
import { EventDeserializationException } from '../exception/event-deserialization.exception';

/**
 * 事件基类
 */
export class BaseEvent<E extends EventType, T> {
  /**
   * 触发事件的请求ID
   */
  private readonly requestId: string;

  /**
   * 事件名
   */
  private readonly eventName: E;

  /**
   * 事件负载
   */
  private readonly payload: T | undefined;

  constructor(requestId: string, eventName: E, payload?: T) {
    this.requestId = requestId;
    this.eventName = eventName;
    this.payload = payload;
  }

  public getRequestId(): string {
    return this.requestId;
  }

  public getEventName(): E {
    return this.eventName;
  }

  public getPayload(): T | undefined {
    return this.payload;
  }

  public getPayloadWithRequestId(): { requestId: string } | (T & { requestId: string }) {
    return {
      ...this.payload,
      requestId: this.requestId,
    };
  }

  public toJsonString(): string {
    return JSON.stringify({ requestId: this.requestId, eventName: this.eventName, payload: this.payload });
  }

  public static fromJsonString<E extends EventType, T>(jsonString: string): BaseEvent<E, T> {
    try {
      const jsonData = JSON.parse(jsonString);
      const requestId: string = get(jsonData, 'requestId');
      const eventName: E = get(jsonData, 'eventName');
      const payload: T | undefined = get(jsonData, 'payload');
      if (isNil(requestId) || isEmpty(requestId)) {
        throw new EventDeserializationException(new Error('requestId缺失'));
      }

      if (isNil(eventName) || isEmpty(eventName)) {
        throw new EventDeserializationException(new Error('eventName缺失'));
      }

      return new BaseEvent<E, T>(requestId, eventName, payload);
    } catch (error) {
      let errorMsg = '事件信息反序列化失败';
      if (error instanceof EventDeserializationException) {
        errorMsg += `: ${error.message}`;
      }
      throw new Error(errorMsg);
    }
  }
}
