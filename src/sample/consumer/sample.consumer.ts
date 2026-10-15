import { Logger } from 'winston';
import { Channel, Message } from 'amqplib';
import { Controller, Inject } from '@nestjs/common';
import { BaseMessage } from '../../rabbitmq/message/base.message';
import { ContextService } from '../../context/service/context.service';
import { ESampleMessagePattern } from '../enum/sample-message-pattern.enum';
import { InjectLogger } from '../../logger/decorator/inject-logger.decorator';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { InjectClsContext } from '../../context/decorator/inject-cls-context.decorator';

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
  @InjectClsContext()
  async consumeSampleMessage(@Payload() payload: unknown, @Ctx() rmqContext: RmqContext) {
    try {
      const message = BaseMessage.fromJsonObject(payload);
      this.logger.info('[%s] 收到队列消息: message = %j', message.getRequestId(), message);
      // console.log(this.ctx.getRequestId(), message.getRequestId());
    } catch (error) {
      this.logger.error('[%s] 收到队列消息, 消费失败: error = %o, payload = %j', this.ctx.getRequestId(), error, payload);
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
    }
  }
}
