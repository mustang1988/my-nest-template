import { basename } from 'node:path';
import { Injectable } from '@nestjs/common';
import { RedisModule } from '../redis.module';
import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from 'src/logger/logger.module';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { RedisClient, type RedisClientType } from '@redis/client';
import { InjectRedisClient } from './inject-redis-client.decorator';
import configurationLoader from 'src/configuration/configuration-loader';
import { IRedisConfiguration } from 'src/configuration/interface/redis-configuration.interface';

@Injectable()
class TestClass {
  constructor(@InjectRedisClient('default') public readonly defaultRedisClient: RedisClientType) {}
}

describe(basename(__filename), () => {
  let testInstance: TestClass;
  let redisModule: TestingModule;

  beforeAll(async () => {
    redisModule = await Test.createTestingModule({
      imports: [
        LoggerModule,
        RedisModule.forRootAsync({
          useFactory: (configService: ConfigService) => {
            const redisConfig = configService.getOrThrow<Record<string, IRedisConfiguration>>('redis');
            return Object.keys(redisConfig).map((name) => ({ name, ...redisConfig[name] }));
          },
        }),
        ConfigModule.forRoot({ isGlobal: true, load: [configurationLoader], ignoreEnvFile: true }),
      ],
      providers: [TestClass],
    }).compile();
    expect(redisModule);
  });

  it('constructor()', () => {
    testInstance = redisModule.get(TestClass);
    expect(testInstance.defaultRedisClient);
    expect(testInstance.defaultRedisClient instanceof RedisClient);
  });
});
