import { basename } from 'node:path';
import { Test } from '@nestjs/testing';
import { EventModule } from './event.module';

describe(basename(__filename), () => {
  it('constructor()', async () => {
    const eventModule = await Test.createTestingModule({ imports: [EventModule] }).compile();
    expect(eventModule);
  });
});
