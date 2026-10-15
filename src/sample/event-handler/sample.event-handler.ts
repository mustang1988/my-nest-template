import { Logger } from 'winston';
import { OnEvent } from '@nestjs/event-emitter';
import { ClientProxy } from '@nestjs/microservices';
import { SampleEvent } from '../event/sample.event';
import { Inject, Injectable } from '@nestjs/common';
import { SampleMessage } from '../message/sample.message';
import { ContextService } from '../../context/service/context.service';
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
    @Inject() private readonly ctx: ContextService,
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
  onSampleEvent(event: SampleEvent): void {
    this.logger.info('[%s] 收到事件委托: event: %j', event.getRequestId(), event);
    // console.log(this.ctx.getRequestId(), event.getRequestId());
    /**
     * 发送RMQ队列消息
     */
    const message = new SampleMessage(event.getRequestId(), ESampleMessagePattern.SAMPLE_MESSAGE, event.getPayload());

    /**
     * 发送JSON字符串消息
     */
    this.rmqClient.send(message.getPattern(), message.toJsonString()).subscribe();

    /**
     * 发送对象消息
     */
    this.rmqClient.send(message.getPattern(), message).subscribe();
    this.logger.info('[%s] 发送队列消息: message: %j', message.getRequestId(), message);
  }
}
