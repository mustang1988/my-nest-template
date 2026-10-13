import { ConfigModule, ConfigService } from '@nestjs/config';
import { DynamicModule, Module, Provider } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { IRabbitmqClientOptions } from './interface/rabbitmq-client-options.interface';
import { IRabbitmqModuleAsyncOptions } from './interface/rabbitmq-module-options.interface';
import { getRabbitmqClientToken, RABBITMQ_CLIENTS_MAP, RABBITMQ_MODULE_ASYNC_OPTIONS } from './rabbitmq.constant';

/**
 * Rabbitmq模块
 *
 * - 动态模块
 */
@Module({})
export class RabbitmqModule {
  static forRootAsync(options: IRabbitmqModuleAsyncOptions): DynamicModule {
    const { inject = [ConfigService], names = ['default'], isGlobal = true, imports = [ConfigModule] } = options;

    const rabbitmqConfigProvider: Provider<Array<IRabbitmqClientOptions>> = {
      provide: RABBITMQ_MODULE_ASYNC_OPTIONS,
      inject,
      useFactory: options.useFactory,
    };

    const rabbitmqClientsProvider: Provider<Map<string, ClientProxy>> = {
      provide: RABBITMQ_CLIENTS_MAP,
      inject: [RABBITMQ_MODULE_ASYNC_OPTIONS],
      useFactory: async (rabbitmqConfigs: Array<IRabbitmqClientOptions>) => {
        const rabbitmqClientsMap = new Map<string, ClientProxy>();
        for (const rmqConfOpt of rabbitmqConfigs) {
          if (!names.includes(rmqConfOpt.name)) {
            continue;
          }
          const { username, password, host, port, vhost, queue, name } = rmqConfOpt;
          const rmqClient = ClientProxyFactory.create({
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
          await rmqClient.connect();
          rabbitmqClientsMap.set(name, rmqClient);
        }
        return rabbitmqClientsMap;
      },
    };

    const rabbitmqClients: Array<Provider<ClientProxy>> = names.map((name) => ({
      provide: getRabbitmqClientToken(name),
      inject: [RABBITMQ_CLIENTS_MAP],
      useFactory: (rmqClientsMap: Map<string, ClientProxy>) => {
        const client = rmqClientsMap.get(name);
        if (!client) {
          throw new Error(`Rabbitmq client not found: ${name}`);
        }
        return client;
      },
    }));

    return {
      global: isGlobal,
      module: RabbitmqModule,
      imports,
      providers: [rabbitmqConfigProvider, rabbitmqClientsProvider, ...rabbitmqClients],
      exports: [...rabbitmqClients],
    };
  }
}
