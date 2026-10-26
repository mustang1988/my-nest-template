import { Logger } from 'winston';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ClientProxy } from '@nestjs/microservices';
import { SampleEvent } from '../event/sample.event';
import { SampleMessage } from '../message/sample.message';
import { ESampleEventPattern } from '../enum/sample-event-pattern.enum';
import { ESampleMessagePattern } from '../enum/sample-message-pattern.enum';
import { InjectLogger } from '../../logger/decorator/inject-logger.decorator';
import { InjectContext } from '../../context/decorator/inject-context.decorator';
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
   * @param event 事件委托负载
   */
  @OnEvent(ESampleEventPattern.SAMPLE_EVENT)
  @InjectContext()
  onSampleEvent(event: SampleEvent): void {
    this.logger.info('[%s] 收到事件委托: event: %j', event.requestId, event);
    /**
     * 发送RMQ队列消息
     */
    const message = new SampleMessage(event.requestId, ESampleMessagePattern.SAMPLE_MESSAGE, event.payload);

    /**
     * 以下两种发送方式二选一即可; 两种同时发送时, 同一事件会被队列消费端消费两次
     */

    /**
     * 方式一: 发送JSON字符串消息
     */
    this.rmqClient
      .send(message.pattern, message.toString())
      .subscribe({ error: (error) => this.logger.error('[%s] 队列消息发送失败: error = %o', message.requestId, error) });

    /**
     * 方式二: 发送对象消息
     */
    this.rmqClient
      .send(message.pattern, message)
      .subscribe({ error: (error) => this.logger.error('[%s] 队列消息发送失败: error = %o', message.requestId, error) });
    this.logger.info('[%s] 发送队列消息: message: %j', message.requestId, message);
  }
}
