import { basename } from 'node:path';
import { Test } from '@nestjs/testing';
import { AppModule } from './app.module';

describe(basename(__filename), () => {
  it('constructor()', async () => {
    const appModule = await Test.createTestingModule({ imports: [AppModule] }).compile();
    expect(appModule);
  });
});
