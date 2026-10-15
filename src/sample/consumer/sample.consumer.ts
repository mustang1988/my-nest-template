import { Logger } from 'winston';
import { Channel, Message } from 'amqplib';
import { Controller, Inject } from '@nestjs/common';
import { SampleMessage } from '../message/sample.message';
import { SampleMessagePipe } from '../pipe/sample-message.pipe';
import { ContextService } from '../../context/service/context.service';
import { ESampleMessagePattern } from '../enum/sample-message-pattern.enum';
import { InjectLogger } from '../../logger/decorator/inject-logger.decorator';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { InjectContext } from '../../context/decorator/inject-cls-context.decorator';

/**
 * 示例队列消费
 */
@Controller()
export class SampleConsumer {
  constructor(
    @Inject() private readonly ctx: ContextService,
    @InjectLogger() private readonly logger: Logger,
  ) {
    this.logger = this.logger.child({ context: this.constructor.name });
  }

  /**
   * 示例队列消息消费
   * @param message 队列消息负载
   * @param rmqContext 队列上下文
   */
  @MessagePattern(ESampleMessagePattern.SAMPLE_MESSAGE)
  @InjectContext()
  async consumeSampleMessage(@Payload(new SampleMessagePipe()) payload: SampleMessage, @Ctx() rmqContext: RmqContext) {
    this.logger.info('[%s] 示例消息消费: payload = %j', payload.requestId, payload);
    try {
      // Do something
    } catch (error) {
      this.logger.error('[%s] 示例消息消费, 消费失败: error = %o', payload.requestId, error);
    } finally {
      /**
       * 手动ack消息
       *
       * 是否手动ack消息取决于队列消费配置选项中的noAck参数[main.ts](../../main.ts)
       *
       * - noAck = true 或未配置noAck参数: 消息自动ack
       * - noAck = false: 在消息消费结束后必须手动ack
       */
      const channel = rmqContext.getChannelRef() as Channel;
      const originalMsg = rmqContext.getMessage() as Message;
      channel.ack(originalMsg);
      this.logger.debug('[%s] 示例消息消费, 消费结束, 队列消息已ACK', payload.requestId);
    }
  }
}
