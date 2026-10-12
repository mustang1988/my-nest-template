import { DataSource } from 'typeorm';
import { ModuleRef } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { RedisClientType } from '@redis/client';
import { ClientProxy } from '@nestjs/microservices';
import { Get, Controller, Inject } from '@nestjs/common';
import { AmqpConnectionManager } from 'amqp-connection-manager';
import { getRedisClientToken } from '../../redis/redis.constant';
import { getMySQLDataSourceToken } from '../../mysql/mysql.constant';
import { getRabbitmqClientToken } from '../../rabbitmq/rabbitmq.constant';
import { IHealthCheckResult } from '../interface/health-check-result.interface';
import { IRedisConfiguration } from '../../configuration/interface/redis-configuration.interface';
import { IMySQLConfiguration } from '../../configuration/interface/mysql-configuration.interface';
import { IRabbitmqConfiguration } from '../../configuration/interface/rabbitmq-configuration.interface';

@Controller('/api')
export class HealthCheckController {
  constructor(
    @Inject() private readonly moduleRef: ModuleRef,
    @Inject() private readonly configService: ConfigService,
  ) {}

  @Get('/healthcheck')
  async actionHealthCheck(): Promise<IHealthCheckResult> {
    const result: IHealthCheckResult = {};

    // #region Redis连接客户端健康检查
    const redisConfigs = this.configService.get<Record<string, IRedisConfiguration>>('redis');
    if (redisConfigs) {
      result.redis = {};
      const redisNames = Object.keys(redisConfigs);
      for (const redisName of redisNames) {
        const redisClient = this.moduleRef.get<RedisClientType>(getRedisClientToken(redisName), { strict: false });
        result.redis[redisName] = redisClient.isOpen ? 'healthy' : 'unhealthy';
      }
    }
    // #endregion

    // #region MySQL数据源健康检查
    const mysqlConfigs = this.configService.get<Record<string, IMySQLConfiguration>>('mysql');
    if (mysqlConfigs) {
      result.mysql = {};
      const mysqlDataSourceNames = Object.keys(mysqlConfigs);
      for (const mysqlName of mysqlDataSourceNames) {
        const mysqlDataSource = this.moduleRef.get<DataSource>(getMySQLDataSourceToken(mysqlName), { strict: false });
        result.mysql[mysqlName] = mysqlDataSource.isInitialized ? 'healthy' : 'unhealthy';
      }
    }
    // #endregion

    // #region Rabbitmq连接客户端健康检查
    const rabbitmqConfigs = this.configService.get<Record<string, IRabbitmqConfiguration>>('rabbitmq');
    if (rabbitmqConfigs) {
      result.rabbitmq = {};
      const rabbitmqNames = Object.keys(rabbitmqConfigs);
      for (const rabbitmqName of rabbitmqNames) {
        const rabbitmqClient = this.moduleRef.get<ClientProxy>(getRabbitmqClientToken(rabbitmqName), { strict: false });
        result.rabbitmq[rabbitmqName] = rabbitmqClient.unwrap<AmqpConnectionManager>().isConnected() ? 'healthy' : 'unhealthy';
      }
    }
    // #endregion

    return result;
  }
}
