export type EventType = symbol | string | Array<string> | Array<symbol>;

export interface IRedisEventMessage<E extends EventType, P> {
  event: E;
  payload: P;
}
