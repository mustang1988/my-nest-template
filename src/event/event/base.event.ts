import { get, isEmpty } from 'lodash';
import { EventType } from '../type/event.type';

export class BaseEvent<E extends EventType, T> {
  private readonly requestId: string;
  private readonly eventName: E;
  private readonly payload: T;

  constructor(requestId: string, eventName: E, payload: T) {
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

  public getPayload(): T {
    return this.payload;
  }

  public getPayloadWithRequestId(): T & { requestId: string } {
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
      const requestId = get(jsonData, 'requestId');
      const eventName = get(jsonData, 'eventName');
      const payload = get(jsonData, 'payload');
      if (isEmpty(requestId) || isEmpty(eventName) || isEmpty(payload)) {
        throw new Error('事件信息反序列化失败');
      }
      return new BaseEvent(requestId, eventName, payload);
    } catch (error) {
      throw new Error('事件信息反序列化失败');
    }
  }
}
