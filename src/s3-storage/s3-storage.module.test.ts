import { basename } from 'node:path';
import { Test } from '@nestjs/testing';
import { S3StorageModule } from './s3-storage.module';
import { LoggerModule } from 'src/logger/logger.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configurationLoader from 'src/configuration/configuration-loader';
import { IS3StorageConfiguration } from 'src/configuration/interface/s3-storage.interface';
import { faker } from '@faker-js/faker';

describe(basename(__filename), () => {
  describe('forRootAsync()', () => {
    it('全默认', async () => {
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

    it('指定名称配置不初始化', async () => {
      const redisModule = await Test.createTestingModule({
        imports: [
          LoggerModule,
          S3StorageModule.forRootAsync({
            useFactory: (configService: ConfigService) => {
              const s3Config = configService.getOrThrow<Record<string, IS3StorageConfiguration>>('s3Storage');
              const options = Object.keys(s3Config).map((name) => ({ name, ...s3Config[name] }));
              options.push({
                name: faker.lorem.word(),
                endpoint: faker.internet.url(),
                region: faker.lorem.word(),
                accessKeyId: faker.lorem.word(),
                secretAccessKey: faker.lorem.word(),
              });
              return options;
            },
          }),
          ConfigModule.forRoot({ isGlobal: true, load: [configurationLoader], ignoreEnvFile: true }),
        ],
      }).compile();
      expect(redisModule);
    });

    it('指定名称不存在', async () => {
      try {
        await Test.createTestingModule({
          imports: [
            LoggerModule,
            S3StorageModule.forRootAsync({
              names: [faker.lorem.word()],
              useFactory: (configService: ConfigService) => {
                const s3Config = configService.getOrThrow<Record<string, IS3StorageConfiguration>>('s3Storage');
                return Object.keys(s3Config).map((name) => ({ name, ...s3Config[name] }));
              },
            }),
            ConfigModule.forRoot({ isGlobal: true, load: [configurationLoader], ignoreEnvFile: true }),
          ],
        }).compile();
      } catch (error) {
        expect(error);
      }
    });
  });
});
