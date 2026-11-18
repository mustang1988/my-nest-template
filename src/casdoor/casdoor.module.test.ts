import { basename } from 'node:path';
import { Test } from '@nestjs/testing';
import { SDK } from 'casdoor-nodejs-sdk';
import { ConfigModule } from '@nestjs/config';
import { CasdoorModule } from './casdoor.module';
import { CASDOOR_SDK_TOKEN } from './casdoor.constant';
import { CommonModule } from 'src/common/common.module';
import { LoggerModule } from 'src/logger/logger.module';
import { ContextModule } from 'src/context/context.module';
import configurationLoader from 'src/configuration/configuration-loader';

describe(basename(__filename), () => {
  it('constructor()', async () => {
    const casdoorModule = await Test.createTestingModule({
      imports: [
        CommonModule,
        ConfigModule.forRoot({ isGlobal: true, load: [configurationLoader], ignoreEnvFile: true }),
        ContextModule,
        LoggerModule,
        CasdoorModule,
      ],
    }).compile();
    expect(casdoorModule);
    const casdoorSdk = casdoorModule.get<SDK>(CASDOOR_SDK_TOKEN);
    expect(casdoorSdk).not.toStrictEqual(undefined);
  });
});
