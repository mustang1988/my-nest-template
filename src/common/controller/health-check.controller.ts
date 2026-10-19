import { DataSource } from 'typeorm';
import { ModuleRef } from '@nestjs/core';
import { randomUUID } from 'node:crypto';
import { ConfigService } from '@nestjs/config';
import { RedisClientType } from '@redis/client';
import { ClientProxy } from '@nestjs/microservices';
import { Get, Controller, Inject } from '@nestjs/common';
import { AmqpConnectionManager } from 'amqp-connection-manager';
import { getRedisClientToken } from '../../redis/redis.constant';
import { S3Client, ListBucketsCommand } from '@aws-sdk/client-s3';
import { ContextService } from 'src/context/service/context.service';
import { getMySQLDataSourceToken } from '../../mysql/mysql.constant';
import { getS3ClientToken } from '../../s3-storage/s3-storage.constant';
import { getRabbitmqClientToken } from '../../rabbitmq/rabbitmq.constant';
import { IHealthCheckResult } from '../interface/health-check-result.interface';
import { IS3StorageConfiguration } from '../../configuration/interface/s3-storage.interface';
import { IRedisConfiguration } from '../../configuration/interface/redis-configuration.interface';
import { IMySQLConfiguration } from '../../configuration/interface/mysql-configuration.interface';
import { IRabbitmqConfiguration } from '../../configuration/interface/rabbitmq-configuration.interface';

/**
 * 服务健康检查控制器
 */
@Controller('/api')
export class HealthCheckController {
  constructor(
    @Inject() private readonly ctx: ContextService,
    @Inject() private readonly moduleRef: ModuleRef,
    @Inject() private readonly configService: ConfigService,
  ) {}

  /**
   * 服务健康检查API
   * @return 健康检查结果
   */
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
        if (redisClient) {
          /**
           * 发送ping命令进行健康检查
           */
          const pingMsg = randomUUID();
          const redisPingRes = await redisClient.ping(pingMsg);
          result.redis[redisName] = pingMsg === redisPingRes ? 'healthy' : 'unhealthy';
        }
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
        if (mysqlDataSource) {
          /**
           * 查询mysql版本信息进行健康检查
           */
          const versionQueryRes = await mysqlDataSource.createQueryRunner().manager.query<Array<any>>(`SELECT version() as version FROM DUAL`);
          result.mysql[mysqlName] = versionQueryRes.length !== 0 ? 'healthy' : 'unhealthy';
        }
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
        if (rabbitmqClient) {
          /**
           * 通过Rabbitmq连接状态进行健康检查
           */
          result.rabbitmq[rabbitmqName] = rabbitmqClient.unwrap<AmqpConnectionManager>().isConnected() ? 'healthy' : 'unhealthy';
        }
      }
    }
    // #endregion

    // #region S3健康检查
    const s3Configs = this.configService.get<Record<string, IS3StorageConfiguration>>('s3Storage');
    if (s3Configs) {
      result.s3 = {};
      const s3Names = Object.keys(s3Configs);
      for (const s3Name of s3Names) {
        const s3Client = this.moduleRef.get<S3Client>(getS3ClientToken(s3Name), { strict: false });
        if (s3Client) {
          try {
            /**
             * 通过ListBucket命令进行健康检查
             */
            const listBucketCommand = new ListBucketsCommand({});
            const res = await s3Client.send(listBucketCommand);
            result.s3[s3Name] = Array.isArray(res.Buckets) ? 'healthy' : 'unhealthy';
          } catch {
            result.s3[s3Name] = 'unhealthy';
          }
        }
      }
    }
    // #endregion

    console.log('%o', this.ctx.getAll());

    return result;
  }
}
