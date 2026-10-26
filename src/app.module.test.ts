import { basename } from 'node:path';
import { AppModule } from './app.module';
import { Test, TestingModule } from '@nestjs/testing';

describe(basename(__filename), () => {
  let testModule: TestingModule;

  it('constructor()', async () => {
    testModule = await Test.createTestingModule({ imports: [AppModule] }).compile();
    expect(testModule);
  });

  afterAll(async () => {
    await testModule.close();
  });
});
