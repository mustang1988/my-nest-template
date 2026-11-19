import { basename } from 'node:path';
import { Test } from '@nestjs/testing';
import { ContextModule } from './context.module';

describe(basename(__filename), () => {
  it('constructor()', async () => {
    const contextModule = await Test.createTestingModule({ imports: [ContextModule] }).compile();
    expect(contextModule);
  });
});
