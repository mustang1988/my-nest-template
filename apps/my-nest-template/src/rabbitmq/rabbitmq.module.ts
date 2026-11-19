import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AmqpConnectionManager } from 'amqp-connection-manager';
import { DynamicModule, Module, Provider } from '@nestjs/common';
import { DataMaskingUtil } from '../common/util/data-masking.util';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { IRabbitmqClientOptions } from './interface/rabbitmq-client-options.interface';
import { IRabbitmqModuleAsyncOptions } from './interface/rabbitmq-module-options.interface';
import { getInjectRabbitmqClientRegistry } from './decorator/inject-rabbitmq-client.decorator';
import { RabbitmqClientNotFoundException } from './exception/rabbitmq-client-not-found.exception';
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

    /**
     * 待使用的Rabbitmq连接名称集合
     *
     * 取@InjectRabbitmqClient()装饰器注册表与本模块`names`的交集;
     * 只有实际通过装饰器注入使用的连接才会建立连接与注册Provider, 配置中存在但未被使用的连接不初始化
     */
    const usedNames = new Set(Array.from(getInjectRabbitmqClientRegistry()).filter((name) => names.includes(name)));

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
          if (!usedNames.has(rmqConfOpt.name)) {
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
              socketOptions: {
                /**
                 * 断链自动重连配置(底层连接基于amqp-connection-manager)
                 *
                 * - heartbeatIntervalInSeconds: 心跳间隔(秒), 用于及时检测断链
                 * - reconnectTimeInSeconds: 断链后重连间隔(秒), 默认与心跳间隔一致
                 *
                 * 断链后自动无限重连, 重连成功后自动重建channel
                 */
                heartbeatIntervalInSeconds: 5,
                reconnectTimeInSeconds: 5,
              },
            },
          });
          await rmqClient.connect();
          /**
           * 断链与自动重连事件日志
           *
           * 在connect()之后挂载, 首次连接的connect事件不会重复记录
           */
          const connectionManager = rmqClient.unwrap<AmqpConnectionManager>();
          connectionManager.on('connect', () => logger.info('Rabbitmq发送端连接建立(含断链自动重连): name = %s', name));
          connectionManager.on('disconnect', ({ err }) => logger.error('Rabbitmq发送端断链, 将自动重连: name = %s, error = %o', name, err));
          connectionManager.on('connectFailed', ({ err }) => logger.error('Rabbitmq发送端连接失败, 将继续重试: name = %s, error = %o', name, err));
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

    const rabbitmqClients: Array<Provider<ClientProxy>> = names
      .filter((name) => usedNames.has(name))
      .map((name) => ({
        provide: getRabbitmqClientToken(name),
        inject: [RABBITMQ_CLIENTS_MAP_TOKEN, WINSTON_MODULE_PROVIDER],
        useFactory: (rmqClientsMap: Map<string, ClientProxy>, logger: Logger) => {
          logger = logger.child({ context: this.name });
          const client = rmqClientsMap.get(name);
          if (!client) {
            logger.error('未找到指定名称的Rabbitmq客户端对象: name = %s', name);
            throw new RabbitmqClientNotFoundException(name);
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
