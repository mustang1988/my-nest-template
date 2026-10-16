import { basename } from 'node:path';
import { Test } from '@nestjs/testing';
import { S3StorageModule } from './s3-storage.module';
import { LoggerModule } from 'src/logger/logger.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configurationLoader from 'src/configuration/configuration-loader';
import { IS3StorageConfiguration } from 'src/configuration/interface/s3-storage.interface';

describe(basename(__filename), () => {
  it('forRootAsync()', async () => {
    const redisModule = await Test.createTestingModule({
      imports: [
        LoggerModule,
        S3StorageModule.forRootAsync({
          useFactory: (configService: ConfigService) => {
            const s3Config = configService.getOrThrow<Record<string, IS3StorageConfiguration>>('s3Storage');
            return Object.keys(s3Config).map((name) => ({ name, ...s3Config[name] }));
          },
        }),
        ConfigModule.forRoot({ isGlobal: true, load: [configurationLoader], ignoreEnvFile: true }),
      ],
    }).compile();
    expect(redisModule);
  });
});
