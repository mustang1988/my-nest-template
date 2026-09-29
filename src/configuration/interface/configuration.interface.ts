import { IAppConfiguration } from './app-configuration.interface';
import { IRedisConfiguration } from './redis-configuration.interface';
import { IMySQLConfiguration } from './mysql-configuration.interface';
import { ILoggerConfiguration } from './logger-configuration.interface';

export interface IConfiguration {
  app: IAppConfiguration;
  logger: ILoggerConfiguration;
  redis?: Record<string, IRedisConfiguration>;
  mysql?: Record<string, IMySQLConfiguration>;
  constants?: Record<string, unknown>;
}
