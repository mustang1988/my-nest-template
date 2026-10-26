import { ServerOptions } from 'socket.io';
import { ConfigService } from '@nestjs/config';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient, RedisClientType } from '@redis/client';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { IRedisConfiguration } from 'src/configuration/interface/redis-configuration.interface';

/**
 * 基于Redis的Socket.IO适配器
 */
export class RedisSocketIoAdapter extends IoAdapter {
  private readonly name: string;
  private readonly app: NestFastifyApplication;
  private readonly publishClient: RedisClientType;
  private readonly subscrubeClient: RedisClientType;
  private adapterConstructor: ReturnType<typeof createAdapter>;

  constructor(app: NestFastifyApplication, name?: string) {
    super(app);
    this.app = app;
    this.name = name ?? 'default';
    const configService = this.app.get(ConfigService);
    const redisConfig = configService.getOrThrow<IRedisConfiguration>(`redis.${this.name}`);
    this.publishClient = createClient({
      socket: {
        host: redisConfig.host,
        port: redisConfig.port,
        /**
         * 断链自动重连策略
         *
         * 返回值为下次重连的等待毫秒数; 此处配置为重试次数 * 100ms, 上限3000ms, 无限重试
         */
        reconnectStrategy: (retries: number) => Math.min(retries * 100, 3000),
      },
      username: redisConfig.username,
      password: redisConfig.password,
      database: redisConfig.db,
    });
    this.subscrubeClient = this.publishClient.duplicate();
  }

  async connectToRedis(): Promise<void> {
    await Promise.all([this.publishClient.connect(), this.subscrubeClient.connect()]);
    this.adapterConstructor = createAdapter(this.publishClient, this.subscrubeClient);
  }

  createIOServer(port: number, options?: ServerOptions): any {
    const server = super.createIOServer(port, options);
    server.adapter(this.adapterConstructor);
    return server;
  }
}
