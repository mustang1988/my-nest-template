import { basename } from 'node:path';
import { Injectable } from '@nestjs/common';
import { S3Client } from '@aws-sdk/client-s3';
import { Test, TestingModule } from '@nestjs/testing';
import { S3StorageModule } from '../s3-storage.module';
import { LoggerModule } from 'src/logger/logger.module';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { InjectS3Client } from './inject-s3-client.decorator';
import configurationLoader from 'src/configuration/configuration-loader';
import { IS3StorageConfiguration } from 'src/configuration/interface/s3-storage.interface';

@Injectable()
class TestClass {
  constructor(@InjectS3Client('default') public readonly defaultS3Client: S3Client) {}
}

describe(basename(__filename), () => {
  let testInstance: TestClass;
  let s3StorageModule: TestingModule;

  beforeAll(async () => {
    s3StorageModule = await Test.createTestingModule({
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
      providers: [TestClass],
    }).compile();
    expect(s3StorageModule);
  });

  it('constructor()', () => {
    testInstance = s3StorageModule.get(TestClass);
    expect(testInstance.defaultS3Client);
    expect(testInstance.defaultS3Client instanceof S3Client);
  });
});
