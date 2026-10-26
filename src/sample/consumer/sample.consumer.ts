import { Channel, Message } from 'amqplib';
import { Controller } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SampleMessage } from '../message/sample.message';
import { ContextService } from '../../context/service/context.service';
import { ESampleMessagePattern } from '../enum/sample-message-pattern.enum';
import { AutoContextLogger } from '../../logger/auto-context-logger';
import { RabbitmqMessagePipe } from 'src/rabbitmq/pipe/rabbitmq-message.pipe';
import { InjectContext } from '../../context/decorator/inject-context.decorator';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';

/**
 * 示例队列消费
 */
@Controller()
export class SampleConsumer extends AutoContextLogger {
  /**
   * 队列消息是否自动ACK
   *
   * 对应消费端连接配置中的noAck选项[main.ts](../../main.ts); noAck为true时Rabbitmq在消息投递后自动ACK, 消费端不能再手动ACK(否则会抛出异常)
   */
  private readonly noAck: boolean;

  constructor(
    private readonly ctx: ContextService,
    private readonly configService: ConfigService,
  ) {
    super();
    this.noAck = this.configService.getOrThrow<boolean>('rabbitmq.default.noAck');
  }

  /**
   * 示例队列消息消费
   * @param message 队列消息负载
   * @param rmqContext 队列上下文
   */
  @MessagePattern(ESampleMessagePattern.SAMPLE_MESSAGE)
  @InjectContext()
  async consumeSampleMessage(@Payload(new RabbitmqMessagePipe(SampleMessage)) payload: SampleMessage, @Ctx() rmqContext: RmqContext) {
    this.logger.info('[%s] 示例消息消费: payload = %j', payload.requestId, payload);
    try {
      // Do something
    } catch (error) {
      /**
       * 消费失败的消息此处仍然会被ACK丢弃, 避免异常消息无限重投;
       * 如需失败重试, 可在此改为channel.nack(originalMsg, false, true)重回队列, 或配合死信队列处理
       */
      this.logger.error('[%s] 示例消息消费, 消费失败: error = %o', payload.requestId, error);
    } finally {
      if (!this.noAck) {
        /**
         * 手动ack消息
         *
         * 仅在noAck = false(手动ACK模式)下需要且允许手动ack
         */
        const channel = rmqContext.getChannelRef() as Channel;
        const originalMsg = rmqContext.getMessage() as Message;
        channel.ack(originalMsg);
        this.logger.debug('[%s] 示例消息消费, 消费结束, 队列消息已ACK', payload.requestId);
      }
    }
  }
}
