import { basename } from 'node:path';
import { Test } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { RedisModule } from './redis.module';
import type { RedisClientType } from '@redis/client';
import { LoggerModule } from 'src/logger/logger.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configurationLoader from 'src/configuration/configuration-loader';
import { InjectRedisClient } from './decorator/inject-redis-client.decorator';
import { RedisClientNotFoundException } from './exception/redis-client-not-found.exception';
import { IRedisConfiguration } from 'src/configuration/interface/redis-configuration.interface';

/**
 * 注册表登记用测试类: 使'default'连接进入@InjectRedisClient()装饰器注册表, 令forRootAsync()为其注册连接客户端Provider
 */
@Injectable()
class TestClass {
  constructor(@InjectRedisClient('default') public readonly defaultRedisClient: RedisClientType) {}
}

describe(basename(__filename), () => {
  describe('forRootAsync()', () => {
    it('全默认', async () => {
      const redisModule = await Test.createTestingModule({
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
      const testInstance = redisModule.get(TestClass);
      expect(testInstance.defaultRedisClient);
      await redisModule.close();
    });

    it('指定名称配置不初始化', async () => {
      const redisModule = await Test.createTestingModule({
        imports: [
          LoggerModule,
          EventEmitterModule.forRoot({ global: true }),
          RedisModule.forRootAsync({
            useFactory: (configService: ConfigService) => {
              const redisConfig = configService.getOrThrow<Record<string, IRedisConfiguration>>('redis');
              const options = Object.keys(redisConfig).map((name) => ({ name, ...redisConfig[name] }));
              options.push({
                name: faker.lorem.word(), // 不存在
                host: faker.internet.ipv4(),
              });
              return options;
            },
          }),
          ConfigModule.forRoot({ isGlobal: true, load: [configurationLoader], ignoreEnvFile: true }),
        ],
      }).compile();
      expect(redisModule);
      await redisModule.close();
    });

    it('指定名称不存在', async () => {
      /**
       * 先通过装饰器登记随机名称, 使对应Provider被注册(配置中不存在该名称的连接, Provider工厂初始化时应抛出异常)
       */
      const notExistsName = faker.lorem.word();
      InjectRedisClient(notExistsName);
      try {
        await Test.createTestingModule({
          imports: [
            LoggerModule,
            EventEmitterModule.forRoot({ global: true }),
            RedisModule.forRootAsync({
              names: [notExistsName], // 随机名称
              useFactory: (configService: ConfigService) => {
                const redisConfig = configService.getOrThrow<Record<string, Required<IRedisConfiguration>>>('redis');
                return Object.keys(redisConfig).map((name) => ({ name, ...redisConfig[name] }));
              },
            }),
            ConfigModule.forRoot({ isGlobal: true, load: [configurationLoader], ignoreEnvFile: true }),
          ],
        }).compile();
      } catch (error) {
        expect(error);
        expect(error instanceof RedisClientNotFoundException);
      }
    });
  });
});
