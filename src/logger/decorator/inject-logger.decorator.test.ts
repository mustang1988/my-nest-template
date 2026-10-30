import { Logger } from 'winston';
import { basename } from 'node:path';
import { Injectable } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from '../logger.module';
import { Test, TestingModule } from '@nestjs/testing';
import { InjectLogger } from './inject-logger.decorator';
import configurationLoader from 'src/configuration/configuration-loader';

@Injectable()
class TestClass {
  constructor(@InjectLogger() public readonly logger: Logger) {}
}

describe(basename(__filename), () => {
  let loggerModule: TestingModule;
  let testInstance: TestClass;

  beforeAll(async () => {
    loggerModule = await Test.createTestingModule({
      imports: [LoggerModule, ConfigModule.forRoot({ isGlobal: true, load: [configurationLoader], ignoreEnvFile: true })],
      providers: [TestClass],
    }).compile();
    expect(loggerModule);
    testInstance = loggerModule.get(TestClass);
    expect(testInstance);
  });

  it('@InjectLogger()', () => {
    expect(testInstance.logger);
  });
});
