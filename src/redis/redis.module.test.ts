import { basename } from 'node:path';
import { faker } from '@faker-js/faker';
import { RedisModule } from './redis.module';
import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from 'src/logger/logger.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configurationLoader from 'src/configuration/configuration-loader';
import { RedisClientNotFoundException } from './exception/redis-client-not-found.exception';
import { IRedisConfiguration } from 'src/configuration/interface/redis-configuration.interface';

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
      }).compile();
      expect(redisModule);
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
      try {
        await Test.createTestingModule({
          imports: [
            LoggerModule,
            EventEmitterModule.forRoot({ global: true }),
            RedisModule.forRootAsync({
              names: [faker.lorem.word()], // 随机名称
              useFactory: (configService: ConfigService) => {
                const redisConfig = configService.getOrThrow<Record<string, IRedisConfiguration>>('redis');
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
