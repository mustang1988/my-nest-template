import { basename } from 'node:path';
import { LoggerModule } from '@pgu/logger';
import { Injectable } from '@nestjs/common';
import { RedisModule } from '../redis.module';
import { Test, TestingModule } from '@nestjs/testing';
import { IRedisConfiguration } from '@pgu/configuration';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { RedisClient, type RedisClientType } from '@redis/client';
import { InjectRedisClient } from './inject-redis-client.decorator';
import configurationLoader from '@pgu/configuration/configuration-loader';

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
        EventEmitterModule.forRoot({ global: true }),
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

  afterAll(async () => {
    await redisModule.close();
  });

  it('constructor()', () => {
    testInstance = redisModule.get(TestClass);
    expect(testInstance.defaultRedisClient);
    expect(testInstance.defaultRedisClient instanceof RedisClient);
  });
});
