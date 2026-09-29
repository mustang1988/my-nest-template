import winston from 'winston';
import { Global, Module } from '@nestjs/common';
import DailyRotateFile from 'winston-daily-rotate-file';
import { utilities, WinstonModule } from 'nest-winston';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IAppConfiguration } from '../configuration/interface/app-configuration.interface';
import { ILoggerConfiguration } from '../configuration/interface/logger-configuration.interface';

@Global()
@Module({
  imports: [
    WinstonModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const appConfig = configService.getOrThrow<IAppConfiguration>('app');
        const loggerConfig = configService.getOrThrow<ILoggerConfiguration>('logger');

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

        const loggerTrans: winston.transport[] = [
          new DailyRotateFile({
            level: loggerConfig.level,
            dirname: loggerConfig.dirname,
            maxSize: loggerConfig.maxSize,
            maxFiles: loggerConfig.maxFile,
            format: fileLoggerFormat,
            filename: `${appConfig.title.toLocaleLowerCase()}-%DATE%-main.log`,
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
          }),

          new DailyRotateFile({
            level: 'error',
            dirname: loggerConfig.dirname,
            maxSize: loggerConfig.maxSize,
            maxFiles: loggerConfig.maxFile,
            format: fileLoggerFormat,
            filename: `${appConfig.title.toLocaleLowerCase()}-%DATE%-error.log`,
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
          }),
        ];

        if (loggerConfig.enableConsole) {
          const consoleLoggerFormat = winston.format.combine(
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
            winston.format.ms(),
            winston.format.splat(),
            utilities.format.nestLike(appConfig.title, {
              colors: true,
              prettyPrint: true,
              processId: true,
              appName: true,
            }),
          );

          loggerTrans.push(
            new winston.transports.Console({
              level: loggerConfig.level,
              format: consoleLoggerFormat,
            }),
          );
        }

        return {
          level: loggerConfig.level,
          transports: loggerTrans,
        };
      },
    }),
  ],
})
export class LoggerModule {}
