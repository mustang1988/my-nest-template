import { EnvValueLoadUtil } from './util/env-value-load.util';
import { IConfiguration } from './interface/configuration.interface';

/**
 * 配置加载
 */
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
    jsonLogger: EnvValueLoadUtil.loadOptionalBoolean('LOGGER_JSON', false),
    zippedArchive: EnvValueLoadUtil.loadOptionalBoolean('LOGGER_ZIP', true),
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
      enableSynchronize: EnvValueLoadUtil.loadOptionalBoolean('DEFAULT_MYSQL_SYNC', false),
    },
  },

  rabbitmq: {
    default: {
      host: EnvValueLoadUtil.loadRequiredString('DEFAULT_RABBITMQ_HOST'),
      port: EnvValueLoadUtil.loadOptionalInteger('DEFAULT_RABBITMQ_PORT', 5672),
      username: EnvValueLoadUtil.loadRequiredString('DEFAULT_RABBITMQ_USERNAME'),
      password: EnvValueLoadUtil.loadRequiredString('DEFAULT_RABBITMQ_PASSWORD'),
      vhost: EnvValueLoadUtil.loadOptionalString('DEFAULT_RABBITMQ_VHOST', undefined),
      queue: EnvValueLoadUtil.loadRequiredString('DEFAULT_RABBITMQ_QUEUE'),
      consume: EnvValueLoadUtil.loadRequiredBoolean('DEFAULT_RABBITMQ_CONSUME'),
      prefetchCount: EnvValueLoadUtil.loadOptionalInteger('DEFAULT_RABBITMQ_PREFETCH_COUNT', 1),
      noAck: EnvValueLoadUtil.loadOptionalBoolean('DEFAULT_RABBITMQ_AUTO_ACK', true),
    },
  },

  i18n: {
    fallbackLanguage: EnvValueLoadUtil.loadOptionalString('I18N_FALLBACK_LANGUAGE', 'en-US'),
  },

  s3Storage: {
    default: {
      endpoint: EnvValueLoadUtil.loadRequiredUrl('DEFAULT_S3_ENDPOINT'),
      region: EnvValueLoadUtil.loadOptionalString('DEFAULT_S3_REGION', 'default'),
      accessKeyId: EnvValueLoadUtil.loadRequiredString('DEFAULT_S3_ACCESS_KEY'),
      secretAccessKey: EnvValueLoadUtil.loadRequiredString('DEFAULT_S3_SECRET_KEY'),
    },
  },

  constants: {
    performance: {
      /**
       * 接口性能指标
       *
       * 接口耗时超过指标时会输出WARN级别日志记录
       *
       * 单位: 毫秒
       */
      threshold: EnvValueLoadUtil.loadOptionalInteger('PERFORMANCE_THRESHOLD', 100),
    },

    security: {
      encrypt: {
        /**
         * AES加密密钥
         */
        aesKey: Buffer.from(EnvValueLoadUtil.loadRequiredHexString('AES_KEY'), 'hex'),
        /**
         * AES加密IV
         */
        aesIv: Buffer.from(EnvValueLoadUtil.loadRequiredHexString('AES_IV'), 'hex'),
      },
    },
  },
});
