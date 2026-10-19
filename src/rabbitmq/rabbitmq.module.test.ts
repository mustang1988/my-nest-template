import { basename } from 'node:path';
import { Test } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { RabbitmqModule } from './rabbitmq.module';
import { LoggerModule } from 'src/logger/logger.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configurationLoader from 'src/configuration/configuration-loader';
import { RabbitmqClientNotFoundException } from './exception/rabbitmq-client-not-found.exception';
import { IRabbitmqConfiguration } from 'src/configuration/interface/rabbitmq-configuration.interface';

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
      }).compile();
      expect(rabbitmqModule);
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
    });

    it('指定名称不存在', async () => {
      try {
        await Test.createTestingModule({
          imports: [
            RabbitmqModule.forRootAsync({
              names: [faker.lorem.word()],
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
