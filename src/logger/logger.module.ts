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

        /**
         * 文件日志格式
         */
        const fileLoggerFormat = winston.format.combine(
          winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
          winston.format.ms(),
          winston.format.splat(),
          utilities.format.nestLike(appConfig.title, {
            colors: false,
            prettyPrint: true,
            processId: true,
            appName: true,
          }),
        );

        const loggerTransports: winston.transport[] = [
          /**
           * 按日切分主文件日志
           *
           * 记录配置的level值及以上级别的日志
           */
          new DailyRotateFile({
            level: loggerConfig.level,
            dirname: loggerConfig.dirname,
            maxSize: loggerConfig.maxSize,
            maxFiles: loggerConfig.maxFile,
            format: fileLoggerFormat,
            filename: `${appConfig.title.toLocaleLowerCase()}-%DATE%-main.log`,
            // datePattern: 'YYYY-MM-DD',
            // zippedArchive: true,
          }),

          /**
           * 按日切分异常文件日志
           *
           * 仅记录error及以上级别的日志
           */
          new DailyRotateFile({
            level: 'error',
            dirname: loggerConfig.dirname,
            maxSize: loggerConfig.maxSize,
            maxFiles: loggerConfig.maxFile,
            format: fileLoggerFormat,
            filename: `${appConfig.title.toLocaleLowerCase()}-%DATE%-error.log`,
            // datePattern: 'YYYY-MM-DD',
            // zippedArchive: true,
          }),
        ];

        /**
         * JSON日志
         */
        if (loggerConfig.jsonLogger) {
          loggerTransports.push(
            new DailyRotateFile({
              level: loggerConfig.level,
              dirname: loggerConfig.dirname,
              maxFiles: loggerConfig.maxFile,
              maxSize: loggerConfig.maxSize,
              format: winston.format.json(),
              filename: `${appConfig.title.toLocaleLowerCase()}-%DATE%-main.log.json`,
            }),
          );
        }

        /**
         * 控制台日志
         */
        if (loggerConfig.enableConsole) {
          const consoleLoggerFormat = winston.format.combine(
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSSZ' }),
            winston.format.ms(),
            winston.format.splat(),
            utilities.format.nestLike(appConfig.title, {
              colors: true,
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

        return {
          level: loggerConfig.level,
          transports: loggerTransports,
        };
      },
    }),
  ],
})
export class LoggerModule {}
