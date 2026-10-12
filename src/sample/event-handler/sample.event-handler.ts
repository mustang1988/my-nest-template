import { Logger } from 'winston';
import { OnEvent } from '@nestjs/event-emitter';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { SampleEntity } from '../entity/sample.default.entity';
import { ESampleEventPattern } from '../enum/sample-event-pattern.enum';
import { getRabbitmqClientToken } from '../../rabbitmq/rabbitmq.constant';
import { ESampleMessagePattern } from '../enum/sample-message-pattern.enum';

/**
 * 示例事件委托处理器
 */
@Injectable()
export class SampleEventHandler {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    @Inject(getRabbitmqClientToken('default')) private readonly rmqClient: ClientProxy,
  ) {
    this.logger = this.logger.child({ context: this.constructor.name });
  }

  /**
   * 示例事件委托处理
   *
   * 监听事件: [ESampleEventPattern.SAMPLE_EVENT](../enum/sample-event-pattern.enum.ts)
   *
   * @param eventPayload 事件委托负载
   */
  @OnEvent(ESampleEventPattern.SAMPLE_EVENT)
  onSampleEvent(eventPayload: SampleEntity, { requestId }: { requestId: string }): void {
    this.logger.info('[%s] 收到事件委托: event: %s, payload = %j', requestId, ESampleEventPattern.SAMPLE_EVENT, eventPayload);
    /**
     * 发送RMQ队列消息
     */
    this.rmqClient.send(ESampleMessagePattern.SAMPLE_MESSAGE, { ...eventPayload, requestId }).subscribe();
  }
}
