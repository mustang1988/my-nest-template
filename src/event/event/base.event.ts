import { isEmpty, isNil } from 'lodash';
import { EventType } from '../type/event.type';
import { plainToInstance } from 'class-transformer';
import { EventDeserializationException } from '../exception/event-deserialization.exception';

/**
 * 事件基类
 */
export class BaseEvent<E extends EventType, T> {
  constructor(
    public readonly requestId: string,
    public readonly eventName: E,
    public readonly payload?: T,
  ) {}

  public toString(): string {
    return JSON.stringify({ requestId: this.requestId, eventName: this.eventName, payload: this.payload });
  }

  public static fromString<E extends EventType, T>(jsonString: string): BaseEvent<E, T> {
    try {
      const jsonData = JSON.parse(jsonString);
      return BaseEvent.fromObject<E, T>(jsonData);
    } catch (error) {
      let errorMsg = '事件信息反序列化失败';
      if (error instanceof EventDeserializationException) {
        errorMsg += `: ${error.message}`;
      }
      throw new EventDeserializationException(new Error(errorMsg));
    }
  }

  public static fromObject<E extends EventType, T>(obj: unknown): BaseEvent<E, T> {
    try {
      const event = plainToInstance<BaseEvent<E, T>, unknown>(BaseEvent, obj);
      if (isNil(event.requestId) || isEmpty(event.requestId)) {
        throw new EventDeserializationException(new Error('requestId缺失'));
      }
      if (isNil(event.eventName) || isEmpty(event.eventName)) {
        throw new EventDeserializationException(new Error('eventName缺失'));
      }
      return event;
    } catch (error) {
      let errorMsg = '事件信息反序列化失败';
      if (error instanceof EventDeserializationException) {
        errorMsg += `: ${error.message}`;
      }
      throw new EventDeserializationException(new Error(errorMsg));
    }
  }
}
