import { IS3StorageConfiguration } from './s3-storage.interface';
import { IAppConfiguration } from './app-configuration.interface';
import { Ii18nConfiguration } from './i18n-configuration.interface';
import { IRedisConfiguration } from './redis-configuration.interface';
import { IMySQLConfiguration } from './mysql-configuration.interface';
import { ILoggerConfiguration } from './logger-configuration.interface';
import { IRabbitmqConfiguration } from './rabbitmq-configuration.interface';

/**
 * 项目配置
 */
export interface IConfiguration {
  /**
   * 应用配置
   */
  app: IAppConfiguration;

  /**
   * 日志配置
   */
  logger: ILoggerConfiguration;

  /**
   * Redis连接配置
   */
  redis?: Record<string, IRedisConfiguration>;

  /**
   * MySQL连接配置
   */
  mysql?: Record<string, IMySQLConfiguration>;

  /**
   * 国际化配置
   */
  i18n?: Ii18nConfiguration;

  /**
   * Rabbitmq配置
   */
  rabbitmq?: Record<string, IRabbitmqConfiguration>;

  /**
   * S3存储配置
   */
  s3Storage?: Record<string, IS3StorageConfiguration>;

  /**
   * 常量配置
   */
  constants?: Record<string, unknown>;
}
