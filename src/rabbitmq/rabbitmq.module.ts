import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DynamicModule, Module, Provider } from '@nestjs/common';
import { DataMaskingUtil } from '../common/util/data-masking.util';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { IRabbitmqClientOptions } from './interface/rabbitmq-client-options.interface';
import { IRabbitmqModuleAsyncOptions } from './interface/rabbitmq-module-options.interface';
import { getRabbitmqClientToken, RABBITMQ_CLIENTS_MAP_TOKEN, RABBITMQ_CLIENT_OPTIONS_TOKEN } from './rabbitmq.constant';

/**
 * Rabbitmq模块
 *
 * - 动态模块
 */
@Module({})
export class RabbitmqModule {
  static forRootAsync(options: IRabbitmqModuleAsyncOptions): DynamicModule {
    const { inject = [ConfigService], names = ['default'], isGlobal = true, imports = [ConfigModule] } = options;

    const rabbitmqClientOptionsProvider: Provider<Array<IRabbitmqClientOptions>> = {
      provide: RABBITMQ_CLIENT_OPTIONS_TOKEN,
      inject,
      useFactory: options.useFactory,
    };

    const rabbitmqClientsProvider: Provider<Map<string, ClientProxy>> = {
      provide: RABBITMQ_CLIENTS_MAP_TOKEN,
      inject: [RABBITMQ_CLIENT_OPTIONS_TOKEN, WINSTON_MODULE_PROVIDER],
      useFactory: async (rabbitmqConfigs: Array<IRabbitmqClientOptions>, logger: Logger) => {
        logger = logger.child({ context: this.name });
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
          logger.info(
            'Rabbitmq发送端初始化完成: name = %s, options = %j',
            name,
            DataMaskingUtil.maskingObject(rmqConfOpt, { fields: ['username', 'password'] }),
          );
          rabbitmqClientsMap.set(name, rmqClient);
        }
        return rabbitmqClientsMap;
      },
    };

    const rabbitmqClients: Array<Provider<ClientProxy>> = names.map((name) => ({
      provide: getRabbitmqClientToken(name),
      inject: [RABBITMQ_CLIENTS_MAP_TOKEN, WINSTON_MODULE_PROVIDER],
      useFactory: (rmqClientsMap: Map<string, ClientProxy>, logger: Logger) => {
        logger = logger.child({ context: this.name });
        const client = rmqClientsMap.get(name);
        if (!client) {
          logger.error('未找到指定名称的Rabbitmq客户端对象: name = %s', name);
          throw new Error(`未找到指定名称的Rabbitmq客户端对象: ${name}`);
        }
        return client;
      },
    }));

    return {
      global: isGlobal,
      module: RabbitmqModule,
      imports,
      providers: [rabbitmqClientOptionsProvider, rabbitmqClientsProvider, ...rabbitmqClients],
      exports: [...rabbitmqClients],
    };
  }
}
