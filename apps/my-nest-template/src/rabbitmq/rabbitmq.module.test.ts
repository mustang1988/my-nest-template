import { basename } from 'node:path';
import { Test } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { RabbitmqModule } from './rabbitmq.module';
import { ClientProxy } from '@nestjs/microservices';
import { LoggerModule } from 'src/logger/logger.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configurationLoader from 'src/configuration/configuration-loader';
import { InjectRabbitmqClient } from './decorator/inject-rabbitmq-client.decorator';
import { RabbitmqClientNotFoundException } from './exception/rabbitmq-client-not-found.exception';
import { IRabbitmqConfiguration } from 'src/configuration/interface/rabbitmq-configuration.interface';

/**
 * 注册表登记用测试类: 使'default'连接进入@InjectRabbitmqClient()装饰器注册表, 令forRootAsync()针对性初始化'default'连接
 */
@Injectable()
class TestClass {
  constructor(@InjectRabbitmqClient('default') public readonly defaultRmqClient: ClientProxy) {}
}

describe(basename(__filename), () => {
  describe('forRootAsync()', () => {
    it('全默认', async () => {
      const rabbitmqModule = await Test.createTestingModule({
        imports: [
          RabbitmqModule.forRootAsync({
            useFactory: (configService: ConfigService) => {
              const rmqConfig = configService.getOrThrow<Record<string, Required<IRabbitmqConfiguration>>>('rabbitmq');
              return Object.keys(rmqConfig).map((name) => ({ name, ...rmqConfig[name] }));
            },
          }),
          ConfigModule.forRoot({ isGlobal: true, load: [configurationLoader], ignoreEnvFile: true }),
          LoggerModule,
        ],
        providers: [TestClass],
      }).compile();
      expect(rabbitmqModule);
      const testInstance = rabbitmqModule.get(TestClass);
      expect(testInstance.defaultRmqClient);
      await rabbitmqModule.close();
    });

    it('指定名称配置不初始化', async () => {
      const rabbitmqModule = await Test.createTestingModule({
        imports: [
          RabbitmqModule.forRootAsync({
            useFactory: (configService: ConfigService) => {
              const rmqConfig = configService.getOrThrow<Record<string, Required<IRabbitmqConfiguration>>>('rabbitmq');
              const rmqOptions = Object.keys(rmqConfig).map((name) => ({ name, ...rmqConfig[name] }));
              rmqOptions.push({
                name: faker.lorem.word(),
                host: faker.internet.ipv4(),
                port: faker.internet.port(),
                username: faker.lorem.word(),
                password: faker.lorem.word(),
                vhost: faker.lorem.word(),
                queue: faker.lorem.word(),
                consume: faker.datatype.boolean(),
                prefetchCount: faker.number.int({ min: 1, max: 10 }),
                noAck: faker.datatype.boolean(),
              });
              return rmqOptions;
            },
          }),
          ConfigModule.forRoot({ isGlobal: true, load: [configurationLoader], ignoreEnvFile: true }),
          LoggerModule,
        ],
      }).compile();
      expect(rabbitmqModule);
      await rabbitmqModule.close();
    });

    it('指定名称不存在', async () => {
      /**
       * 先通过装饰器登记随机名称, 使对应Provider被注册(配置中不存在该名称的连接, Provider工厂初始化时应抛出异常)
       */
      const notExistsName = faker.lorem.word();
      InjectRabbitmqClient(notExistsName);
      try {
        await Test.createTestingModule({
          imports: [
            RabbitmqModule.forRootAsync({
              names: [notExistsName],
              useFactory: (configService: ConfigService) => {
                const rmqConfig = configService.getOrThrow<Record<string, Required<IRabbitmqConfiguration>>>('rabbitmq');
                return Object.keys(rmqConfig).map((name) => ({ name, ...rmqConfig[name] }));
              },
            }),
            ConfigModule.forRoot({ isGlobal: true, load: [configurationLoader], ignoreEnvFile: true }),
            LoggerModule,
          ],
        }).compile();
      } catch (error) {
        expect(error);
        expect(error instanceof RabbitmqClientNotFoundException);
      }
    });
  });
});
