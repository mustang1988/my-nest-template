import { OnEvent } from '@nestjs/event-emitter';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ESampleEventPattern } from '../enum/sample-event-pattern.enum';
import { ESampleMessagePattern } from '../enum/sample-message-pattern.enum';
import { DEFAULT_RABBIMTMQ_CLIENT } from '../../rabbitmq/rabbitmq.constant';

/**
 * 示例事件委托处理器
 */
@Injectable()
export class SampleEventHandler {
  constructor(@Inject(DEFAULT_RABBIMTMQ_CLIENT) private readonly rmqClient: ClientProxy) {}

  @OnEvent(ESampleEventPattern.SAMPLE_EVENT)
  onSampleEvent(eventPayload: unknown) {
    /**
     * 发送队列消息
     */
    this.rmqClient.send(ESampleMessagePattern.SAMPLE_MESSAGE, eventPayload).subscribe();
  }
}
