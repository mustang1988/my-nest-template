import { EnvValueLoadUtil } from './util/env-value-load.util';
import { IConfiguration } from './interface/configuration.interface';

export default (): IConfiguration => ({
  app: {
    title: EnvValueLoadUtil.loadOptionalString('APP_TITLE', ''),
    port: EnvValueLoadUtil.loadRequiredInteger('APP_PORT'),
  },
  logger: {
    level: EnvValueLoadUtil.loadOptionalString('LOGGER_LEVEL', 'debug'),
    maxFile: EnvValueLoadUtil.loadOptionalInteger('LOGGER_MAX_FILE', 30),
    maxSize: EnvValueLoadUtil.loadOptionalString('LOGGER_MAX_SIZE', '2g'),
    enableConsole: EnvValueLoadUtil.loadOptionalBoolean('LOGGER_CONSOLE', false),
    dirname: EnvValueLoadUtil.loadOptionalString('LOGGER_DIR', '/tmp'),
    jsonLogger: EnvValueLoadUtil.loadOptionalBoolean('LOGGER_JSON', true),
  },
  redis: {
    default: {
      host: EnvValueLoadUtil.loadRequiredString('DEFAULT_REDIS_HOST'),
      port: EnvValueLoadUtil.loadOptionalInteger('DEFAULT_REDIS_PORT', 6379),
      username: EnvValueLoadUtil.loadOptionalString('DEFAULT_REDIS_USERNAME'),
      password: EnvValueLoadUtil.loadOptionalString('DEFAULT_REDIS_PASSWORD', ''),
      db: EnvValueLoadUtil.loadOptionalInteger('DEFAULT_REDIS_DB', 0),
      eventChannel: EnvValueLoadUtil.loadOptionalString('DEFAULT_REDIS_EVENT_CHANNEL', 'channel:default'),
    },
  },
  mysql: {
    default: {
      host: EnvValueLoadUtil.loadRequiredString('DEFAULT_MYSQL_HOST'),
      port: EnvValueLoadUtil.loadOptionalInteger('DEFAULT_MYSQL_PORT', 3306),
      username: EnvValueLoadUtil.loadRequiredString('DEFAULT_MYSQL_USERNAME'),
      password: EnvValueLoadUtil.loadRequiredString('DEFAULT_MYSQL_PASSWORD'),
      database: EnvValueLoadUtil.loadRequiredString('DEFAULT_MYSQL_DATABASE'),
      charset: EnvValueLoadUtil.loadOptionalString('DEFAULT_MYSQL_CHARSET', 'utf8mb4'),
      timezone: EnvValueLoadUtil.loadOptionalString('DEFAULT_MYSQL_TIMEZONE', '+08:00'),
      enableLogger: EnvValueLoadUtil.loadOptionalBoolean('DEFAULT_MYSQL_LOGGER', false),
      sync: EnvValueLoadUtil.loadOptionalBoolean('DEFAULT_MYSQL_SYNC', false),
    },
  },
  constants: {},
});
