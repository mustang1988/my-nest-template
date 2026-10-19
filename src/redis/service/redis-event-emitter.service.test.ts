import { isInteger } from 'lodash';
import { basename } from 'node:path';
import { Test } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { randomUUID } from 'node:crypto';
import { RedisModule } from '../redis.module';
import { BaseEvent } from 'src/event/event/base.event';
import { LoggerModule } from 'src/logger/logger.module';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { RedisEventEmitterService } from './redis-event-emitter.service';
import configurationLoader from 'src/configuration/configuration-loader';
import { IRedisEventEmitOptions } from '../interface/redis-event-emit-options.interface';
import { RedisClientNotFoundException } from '../exception/redis-client-not-found.exception';
import { IRedisConfiguration } from 'src/configuration/interface/redis-configuration.interface';

describe(basename(__filename), () => {
  let testService: RedisEventEmitterService;

  beforeAll(async () => {
    const redisModule = await Test.createTestingModule({
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
    }).compile();
    expect(redisModule);
    testService = redisModule.get(RedisEventEmitterService);
    expect(testService);
  });

  describe('emit()', () => {
    it('仅提交必填参数', async () => {
      const event = new BaseEvent(randomUUID(), faker.lorem.word());
      const result = await testService.emit(event);
      expect(result);
      expect(Array.isArray(result));
    });

    it('指定发布客户端', async () => {
      const event = new BaseEvent(randomUUID(), faker.lorem.word());
      const options: IRedisEventEmitOptions = { clientName: 'default' };
      const result = await testService.emit(event, options);
      expect(result);
      expect(Array.isArray(result)).toStrictEqual(false);
      expect(isInteger(result));
    });

    it('指定发布客户端无效', async () => {
      try {
        const event = new BaseEvent(randomUUID(), faker.lorem.word());
        const options: IRedisEventEmitOptions = { clientName: faker.lorem.word() };
        await testService.emit(event, options);
      } catch (error) {
        expect(error);
        expect(error instanceof RedisClientNotFoundException);
      }
    });
  });
});
