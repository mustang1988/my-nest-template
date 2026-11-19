import { basename } from 'node:path';
import { Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from './logger.module';
import configurationLoader from 'src/configuration/configuration-loader';

describe(basename(__filename), () => {
  it('constructor()', async () => {
    const loggerModule = await Test.createTestingModule({
      imports: [LoggerModule, ConfigModule.forRoot({ isGlobal: true, load: [configurationLoader], ignoreEnvFile: true })],
    }).compile();
    expect(loggerModule);
  });
});
