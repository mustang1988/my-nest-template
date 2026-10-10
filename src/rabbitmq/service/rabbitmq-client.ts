import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DEFAULT_RABBIMTMQ_CLIENT } from '../rabbitmq.constant';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { IRabbitmqConfiguration } from '../../configuration/interface/rabbitmq-configuration.interface';

export const rabbitmqClients: Array<Provider<ClientProxy>> = [
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
      const defaultRmqClient = ClientProxyFactory.create({
        transport: Transport.RMQ,
        options: {
          urls: [{ protocol: 'amqp', hostname: host, port, username, password, vhost }],
          queue,
          /**
           * 此处需要注意: 发送端必须设置为true
           * @see https://github.com/nestjs/nest/issues/11966
           */
          noAck: true,
          persistent: true,
          queueOptions: { durable: true },
        },
      });
      await defaultRmqClient.connect();
      return defaultRmqClient;
    },
  },
];
