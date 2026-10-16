import { Test } from '@nestjs/testing';
import { basename } from 'node:path';
import { RabbitmqModule } from './rabbitmq.module';
import { LoggerModule } from 'src/logger/logger.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configurationLoader from 'src/configuration/configuration-loader';
import { IRabbitmqConfiguration } from 'src/configuration/interface/rabbitmq-configuration.interface';

describe(basename(__filename), () => {
  it('forRootAsync()', async () => {
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
});
