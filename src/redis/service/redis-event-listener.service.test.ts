import ms from 'ms';
import { basename } from 'node:path';
import { faker } from '@faker-js/faker';
import { randomUUID } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { RedisModule } from '../redis.module';
import { EventModule } from 'src/event/event.module';
import { Test, TestingModule } from '@nestjs/testing';
import { BaseEvent } from 'src/event/event/base.event';
import { LoggerModule } from 'src/logger/logger.module';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import configurationLoader from 'src/configuration/configuration-loader';
import { RedisEventEmitterService } from './redis-event-emitter.service';
import { RedisEventListenerService } from './redis-event-listener.service';
import { IRedisConfiguration } from 'src/configuration/interface/redis-configuration.interface';

describe(basename(__filename), () => {
  let testService: RedisEventListenerService;
  let redisModule: TestingModule;
  let redisEventEmitterService: RedisEventEmitterService;
  let eventEmitter: EventEmitter2;
  const testEvent = faker.lorem.word();

  @Injectable()
  class TestClass {
    @OnEvent(testEvent)
    test(event: BaseEvent<string, undefined>): void {
      console.log(event);
    }
  }

  beforeAll(async () => {
    redisModule = await Test.createTestingModule({
      imports: [
        EventModule,
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
    testService = redisModule.get(RedisEventListenerService);
    expect(testService);
    redisEventEmitterService = redisModule.get(RedisEventEmitterService);
    expect(redisEventEmitterService);
    eventEmitter = redisModule.get(EventEmitter2);
    expect(eventEmitter);
  });

  describe('onModuleInit()', () => {
    it('未指定实例ID', async () => {
      const event = new BaseEvent(randomUUID(), testEvent);
      await redisEventEmitterService.emit(event);
    });

    it('指定当前实例ID', async () => {
      const event = new BaseEvent(randomUUID(), testEvent);
      await redisEventEmitterService.emit(event, { instanceId: 0 });
    });

    it('指定非当前实例ID', async () => {
      const event = new BaseEvent(randomUUID(), testEvent);
      await redisEventEmitterService.emit(event, { instanceId: faker.number.int({ min: 1, max: 5 }) });
    });
  });
});
