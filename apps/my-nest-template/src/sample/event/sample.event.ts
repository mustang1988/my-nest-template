import { BaseEvent } from '../../event/event/base.event';
import { SampleEntity } from '../entity/sample.default.entity';
import { ESampleEventPattern } from '../enum/sample-event-pattern.enum';

/**
 * 示例事件
 */
export class SampleEvent extends BaseEvent<ESampleEventPattern, SampleEntity> {
  constructor(requestId: string, eventName: ESampleEventPattern, sampleEntity: SampleEntity) {
    super(requestId, eventName, sampleEntity);
  }
}
