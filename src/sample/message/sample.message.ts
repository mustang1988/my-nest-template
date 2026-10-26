import { SampleEntity } from '../entity/sample.default.entity';
import { BaseMessage } from '../../rabbitmq/message/base.message';
import { ESampleMessagePattern } from '../enum/sample-message-pattern.enum';

/**
 * 示例队列消息
 */
export class SampleMessage extends BaseMessage<ESampleMessagePattern.SAMPLE_MESSAGE, SampleEntity> {
  constructor(requestId: string, pattern: ESampleMessagePattern.SAMPLE_MESSAGE, payload?: SampleEntity) {
    super(requestId, pattern, payload);
  }
}
