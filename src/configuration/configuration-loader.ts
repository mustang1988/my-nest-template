import { EnvValueLoadUtil } from './util/env-value-load.util';
import { IConfiguration } from './interface/configuration.interface';

export default (): IConfiguration => ({
  app: {
    title: EnvValueLoadUtil.loadString('APP_TITLE'),
    port: EnvValueLoadUtil.loadInteger('APP_PORT'),
  },
  logger: {
    level: EnvValueLoadUtil.loadString('LOGGER_LEVEL', 'debug'),
    maxFile: EnvValueLoadUtil.loadInteger('LOGGER_MAX_FILE', 30),
    maxSize: EnvValueLoadUtil.loadString('LOGGER_MAX_SIZE', '2g'),
    enableConsole: EnvValueLoadUtil.loadBoolean('LOGGER_CONSOLE', false),
    dirname: EnvValueLoadUtil.loadString('LOGGER_DIR', '/tmp'),
  },
  redis: {
    default: {
      host: EnvValueLoadUtil.loadString('DEFAULT_REDIS_HOST'),
      port: EnvValueLoadUtil.loadInteger('DEFAULT_REDIS_PORT', 6379),
      // username: EnvValueLoadUtil.loadString('DEFAULT_REDIS_USERNAME'),
      password: EnvValueLoadUtil.loadString('DEFAULT_REDIS_PASSWORD', ''),
      db: EnvValueLoadUtil.loadInteger('DEFAULT_REDIS_DB', 0),
    },
  },
  mysql: {
    default: {
      host: EnvValueLoadUtil.loadString('DEFAULT_MYSQL_HOST'),
      port: EnvValueLoadUtil.loadInteger('DEFAULT_MYSQL_PORT', 3306),
      username: EnvValueLoadUtil.loadString('DEFAULT_MYSQL_USERNAME'),
      password: EnvValueLoadUtil.loadString('DEFAULT_MYSQL_PASSWORD'),
      database: EnvValueLoadUtil.loadString('DEFAULT_MYSQL_DATABASE'),
      charset: EnvValueLoadUtil.loadString('DEFAULT_MYSQL_CHARSET', 'utf8mb4'),
      timezone: EnvValueLoadUtil.loadString('DEFAULT_MYSQL_TIMEZONE', '+08:00'),
      logger: EnvValueLoadUtil.loadBoolean('DEFAULT_MYSQL_LOGGER', false),
      sync: EnvValueLoadUtil.loadBoolean('DEFAULT_MYSQL_SYNC', false),
    },
  },
  constants: {},
});
