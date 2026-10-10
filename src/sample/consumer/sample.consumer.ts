import { Logger } from 'winston';
import { Channel, Message } from 'amqplib';
import { Controller, Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ESampleMessagePattern } from '../enum/sample-message-pattern.enum';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';

/**
 * 示例队列消费
 */
@Controller()
export class SampleConsumer {
  constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger) {
    this.logger = this.logger.child({ context: this.constructor.name });
  }

  @MessagePattern(ESampleMessagePattern.SAMPLE_MESSAGE)
  async consumeSampleMessage(@Payload() payload: unknown, @Ctx() rmqContext: RmqContext) {
    try {
      this.logger.info('payload: %o, type: %s', payload, typeof payload);
    } catch (error) {
      this.logger.error('error: %o', error);
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
