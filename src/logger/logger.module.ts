import winston from 'winston';
import { Global, Module } from '@nestjs/common';
import DailyRotateFile from 'winston-daily-rotate-file';
import { utilities, WinstonModule } from 'nest-winston';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IAppConfiguration } from '../configuration/interface/app-configuration.interface';
import { ILoggerConfiguration } from '../configuration/interface/logger-configuration.interface';

/**
 * 日志模块
 *
 * - 全局模块
 */
@Global()
@Module({
  imports: [
    WinstonModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const appConfig = configService.getOrThrow<Required<IAppConfiguration>>('app');
        const loggerConfig = configService.getOrThrow<Required<ILoggerConfiguration>>('logger');

        const loggerTransports: winston.transport[] = [];

        // #region 文件日志
        /**
         * 文件日志输出格式
         */
        const fileLoggerFormat = winston.format.combine(
          winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS Z' }),
          winston.format.splat(),
          utilities.format.nestLike(appConfig.title, {
            colors: false, // 文件日志关闭颜色标记
            prettyPrint: true,
            processId: true,
            appName: true,
          }),
        );

        /**
         * 每日切分`主`文件日志
         *
         * 记录配置的level值及以上级别的日志
         */
        const mainDailyLoggerTransport = new DailyRotateFile({
          level: loggerConfig.level,
          dirname: loggerConfig.dirname,
          maxSize: loggerConfig.maxSize,
          maxFiles: loggerConfig.maxFile,
          format: fileLoggerFormat,
          filename: `${appConfig.title.toLocaleLowerCase()}-%DATE%-main.log`,
          zippedArchive: loggerConfig.zippedArchive,
        });
        loggerTransports.push(mainDailyLoggerTransport);

        /**
         * 每日切分`异常`文件日志
         *
         * 仅记录error及以上级别的日志
         */
        const errorDailyLoggerTransport = new DailyRotateFile({
          level: 'error',
          dirname: loggerConfig.dirname,
          maxSize: loggerConfig.maxSize,
          maxFiles: loggerConfig.maxFile,
          format: fileLoggerFormat,
          filename: `${appConfig.title.toLocaleLowerCase()}-%DATE%-error.log`,
          zippedArchive: loggerConfig.zippedArchive,
        });
        loggerTransports.push(errorDailyLoggerTransport);

        /**
         * 每日切分JSON格式`主`文件日志
         */
        if (loggerConfig.jsonLogger) {
          const jsonDailyLoggerTransport = new DailyRotateFile({
            level: loggerConfig.level,
            dirname: loggerConfig.dirname,
            maxFiles: loggerConfig.maxFile,
            maxSize: loggerConfig.maxSize,
            format: winston.format.combine(winston.format.splat(), winston.format.json()),
            filename: `${appConfig.title.toLocaleLowerCase()}-%DATE%-main.log.json`,
            zippedArchive: loggerConfig.zippedArchive,
          });
          loggerTransports.push(jsonDailyLoggerTransport);
        }
        // #endregion

        // #region 控制台日志
        /**
         * 控制台日志
         */
        if (loggerConfig.enableConsole) {
          const consoleLoggerFormat = winston.format.combine(
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS Z' }),
            winston.format.splat(),
            utilities.format.nestLike(appConfig.title, {
              colors: true, // 控制台日志开启颜色标记
              prettyPrint: true,
              processId: true,
              appName: true,
            }),
          );

          loggerTransports.push(
            new winston.transports.Console({
              level: loggerConfig.level,
              format: consoleLoggerFormat,
            }),
          );
        }
        // #endregion

        return {
          level: loggerConfig.level,
          transports: loggerTransports,
        };
      },
    }),
  ],
})
export class LoggerModule {}
