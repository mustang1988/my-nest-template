import { basename } from 'node:path';
import { Test } from '@nestjs/testing';
import { randomUUID } from 'node:crypto';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from './common.module';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ClsService, ClsServiceManager } from 'nestjs-cls';
import { ContextService } from 'src/context/service/context.service';
import configurationLoader from '../configuration/configuration-loader';

describe(basename(__filename), () => {
  it('constructor()', async () => {
    const commonModule = await Test.createTestingModule({
      imports: [CommonModule, ConfigModule.forRoot({ isGlobal: true, load: [configurationLoader], ignoreEnvFile: true })],
    })
      .useMocker((token) => {
        if (token === ContextService) {
          return {
            getRequestId: jest.fn().mockResolvedValue(randomUUID()),
          };
        }
        if (token === ClsService) {
          return ClsServiceManager.getClsService();
        }
        if (token === WINSTON_MODULE_PROVIDER) {
          return {
            child: jest.fn().mockReturnThis(),
          };
        }
      })
      .compile();
    expect(commonModule);
  });
});
