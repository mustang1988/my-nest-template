import { basename } from 'node:path';
import { Test } from '@nestjs/testing';
import { RedisModule } from './redis.module';
import { LoggerModule } from 'src/logger/logger.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configurationLoader from 'src/configuration/configuration-loader';
import { IRedisConfiguration } from 'src/configuration/interface/redis-configuration.interface';

describe(basename(__filename), () => {
  it('forRootAsync()', async () => {
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
  });
});
