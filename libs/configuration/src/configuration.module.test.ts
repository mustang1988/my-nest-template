import { basename } from 'node:path';
import { Test } from '@nestjs/testing';
import { ConfigurationModule } from './configuration.module';

describe(basename(__filename), () => {
  let testModule: ConfigurationModule;

  it('constructor()', async () => {
    testModule = await Test.createTestingModule({ imports: [ConfigurationModule] }).compile();
    expect(testModule);
  });
});
