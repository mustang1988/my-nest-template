import { Inject } from '@nestjs/common';
import { getRabbitmqClientToken } from '../rabbitmq.constant';

/**
 * 注入指定名称的Rabbitmq消息发送客户端
 * @param name Rabbitmq连接名称
 */
export const InjectRabbitmqClient = (name: string) => Inject(getRabbitmqClientToken(name));
