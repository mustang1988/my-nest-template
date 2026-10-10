import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DEFAULT_RABBIMTMQ_CLIENT } from '../rabbitmq.constant';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { IRabbitmqConfiguration } from '../../configuration/interface/rabbitmq-configuration.interface';

export const rabbitmqClients: Array<Provider> = [
  /**
   * 默认Rabbitmq客户端
   *
   * - 用于消息发送
   */
  {
    provide: DEFAULT_RABBIMTMQ_CLIENT,
    inject: [ConfigService],
    useFactory: async (configService: ConfigService): Promise<ClientProxy> => {
      const { username, password, host, port, vhost, queue } = configService.getOrThrow<Required<IRabbitmqConfiguration>>('rabbitmq.default');
      const rmqUrl = `amqp://${encodeURIComponent(username)}:${encodeURIComponent(password)}@${host}:${port}${encodeURIComponent(vhost)}`;
      const defaultRmqClient = ClientProxyFactory.create({
        transport: Transport.RMQ,
        options: {
          urls: [rmqUrl],
          queue: queue,
          noAck: true, // 此处需要注意, rabbitmq发送端必须设置为true, 消费端无限制
          persistent: true,
          queueOptions: {
            durable: true,
          },
        },
      });
      await defaultRmqClient.connect();
      return defaultRmqClient;
    },
  },
];
