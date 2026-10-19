import { basename } from 'node:path';
import { Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { RabbitmqModule } from '../rabbitmq.module';
import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from 'src/logger/logger.module';
import { ConfigService, ConfigModule } from '@nestjs/config';
import configurationLoader from 'src/configuration/configuration-loader';
import { InjectRabbitmqClient } from './inject-rabbitmq-client.decorator';
import { IRabbitmqConfiguration } from 'src/configuration/interface/rabbitmq-configuration.interface';

@Injectable()
class TestClass {
  constructor(@InjectRabbitmqClient('default') public readonly defaultRmqClient: ClientProxy) {}
}

describe(basename(__filename), () => {
  let testInstance: TestClass;
  let rabbitmqModule: TestingModule;

  beforeAll(async () => {
    rabbitmqModule = await Test.createTestingModule({
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
  });

  it('constructor()', () => {
    testInstance = rabbitmqModule.get(TestClass);
    expect(testInstance.defaultRmqClient);
    expect(testInstance.defaultRmqClient instanceof ClientProxy);
  });
});
