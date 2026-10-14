import { Logger } from 'winston';
import { Channel, Message } from 'amqplib';
import { Controller, Inject } from '@nestjs/common';
import { SampleEntity } from '../entity/sample.default.entity';
import { ESampleMessagePattern } from '../enum/sample-message-pattern.enum';
import { InjectLogger } from '../../logger/decorator/inject-logger.decorator';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';

/**
 * 示例队列消费
 */
@Controller()
export class SampleConsumer {
  constructor(@InjectLogger() private readonly logger: Logger) {
    this.logger = this.logger.child({ context: this.constructor.name });
  }

  /**
   * 示例队列消息消费
   * @param payload 队列消息负载
   * @param rmqContext 队列上下文
   */
  @MessagePattern(ESampleMessagePattern.SAMPLE_MESSAGE)
  async consumeSampleMessage(@Payload() payload: SampleEntity & { requestId: string }, @Ctx() rmqContext: RmqContext) {
    try {
      this.logger.info('[%s] 收到RMQ消息: pattern = %s, payload: %j', payload.requestId, ESampleMessagePattern.SAMPLE_MESSAGE, payload);
    } catch (error) {
      this.logger.error(
        '[%s] RMQ消息消费异常: pattern = %s, payload: %j, error: %o',
        payload.requestId,
        ESampleMessagePattern.SAMPLE_MESSAGE,
        payload.requestId,
        error,
      );
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
