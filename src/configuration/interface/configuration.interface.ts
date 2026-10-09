import { IAppConfiguration } from './app-configuration.interface';
import { Ii18nConfiguration } from './i18n-configuration.interface';
import { IRedisConfiguration } from './redis-configuration.interface';
import { IMySQLConfiguration } from './mysql-configuration.interface';
import { ILoggerConfiguration } from './logger-configuration.interface';

/**
 * 配置
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
   * 常量配置
   */
  constants?: Record<string, unknown>;
}
