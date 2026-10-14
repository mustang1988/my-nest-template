import { Logger } from 'winston';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ClientProxy } from '@nestjs/microservices';
import { SampleEntity } from '../entity/sample.default.entity';
import { ESampleEventPattern } from '../enum/sample-event-pattern.enum';
import { ESampleMessagePattern } from '../enum/sample-message-pattern.enum';
import { InjectLogger } from '../../logger/decorator/inject-logger.decorator';
import { InjectClsContext } from '../../context/decorator/inject-cls-context.decorator';
import { InjectRabbitmqClient } from '../../rabbitmq/decorator/inject-rabbitmq-client.decorator';

/**
 * 示例事件委托处理器
 */
@Injectable()
export class SampleEventHandler {
  constructor(
    @InjectLogger() private readonly logger: Logger,
    @InjectRabbitmqClient('default') private readonly rmqClient: ClientProxy,
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
  @InjectClsContext()
  onSampleEvent(eventPayload: SampleEntity, { requestId }: { requestId: string }): void {
    this.logger.info('[%s] 收到事件委托: event: %s, payload = %j', requestId, ESampleEventPattern.SAMPLE_EVENT, eventPayload);
    /**
     * 发送RMQ队列消息
     */
    this.rmqClient.send(ESampleMessagePattern.SAMPLE_MESSAGE, { ...eventPayload, requestId }).subscribe();
  }
}
