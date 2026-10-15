import { SampleEntity } from '../entity/sample.default.entity';
import { BaseMessage } from '../../rabbitmq/message/base.message';
import { ESampleMessagePattern } from '../enum/sample-message-pattern.enum';

export class SampleMessage extends BaseMessage<ESampleMessagePattern, SampleEntity> {}
