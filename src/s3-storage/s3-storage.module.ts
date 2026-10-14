import { Logger } from 'winston';
import { S3Client } from '@aws-sdk/client-s3';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DynamicModule, Module, Provider } from '@nestjs/common';
import { IS3ClientOptions } from './interface/s3-client-options.interface';
import { IS3StorageModuleAsyncOptions } from './interface/s3-storage-module-options.interface';
import { getS3ClientToken, S3_CLIENT_OPTIONS_TOKEN, S3_CLIENTS_MAP_TOKEN } from './s3-storage.constant';

/**
 * S3存储模块
 *
 * - 动态模块
 */
@Module({})
export class S3StorageModule {
  static forRootAsync(options: IS3StorageModuleAsyncOptions): DynamicModule {
    const { isGlobal = true, names = ['default'], inject = [ConfigService], imports = [ConfigModule] } = options;

    const s3ClientOptions: Provider<Array<IS3ClientOptions>> = {
      provide: S3_CLIENT_OPTIONS_TOKEN,
      inject,
      useFactory: options.useFactory,
    };

    const s3ClientsMap: Provider<Map<string, S3Client>> = {
      provide: S3_CLIENTS_MAP_TOKEN,
      inject: [S3_CLIENT_OPTIONS_TOKEN],
      useFactory: (s3ClientOptions: Array<IS3ClientOptions>) => {
        const s3ClientMap = new Map<string, S3Client>();
        for (const s3ClientOpt of s3ClientOptions) {
          if (!names.includes(s3ClientOpt.name)) {
            continue;
          }
          const s3Client = new S3Client({
            endpoint: s3ClientOpt.endpoint,
            region: s3ClientOpt.region,
            credentials: {
              accessKeyId: s3ClientOpt.accessKeyId,
              secretAccessKey: s3ClientOpt.secretAccessKey,
            },
          });
          s3ClientMap.set(s3ClientOpt.name, s3Client);
        }
        return s3ClientMap;
      },
    };

    const s3Clients: Array<Provider<S3Client>> = names.map((name) => {
      return {
        provide: getS3ClientToken(name),
        inject: [S3_CLIENTS_MAP_TOKEN, WINSTON_MODULE_PROVIDER],
        useFactory: (s3ClientsMap: Map<string, S3Client>, logger: Logger) => {
          const s3Client = s3ClientsMap.get(name);
          if (!s3Client) {
            logger.error('未找到指定名称的S3客户端对象', name);
            throw new Error(`未找到指定名称的S3客户端对象: ${name}`);
          }
          return s3Client;
        },
      };
    });

    return {
      global: isGlobal,
      module: S3StorageModule,
      imports,
      providers: [s3ClientOptions, s3ClientsMap, ...s3Clients],
      exports: [...s3Clients],
    };
  }
}
