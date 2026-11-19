import { basename } from 'node:path';
import { Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import configurationLoader from '@pgu/configuration/configuration-loader';
import { InternationalizationModule } from './internationalization.module';

describe(basename(__filename), () => {
  it('constructor()', async () => {
    const i18nModule = await Test.createTestingModule({
      imports: [InternationalizationModule, ConfigModule.forRoot({ isGlobal: true, load: [configurationLoader], ignoreEnvFile: true })],
    }).compile();
    expect(i18nModule);
  });
});
