import { Global, Module } from '@nestjs/common';
import { HealthCheckController } from './controller/health-check.controller';
import { JsonResponseInterceptor } from './interceptor/json-response.interceptor';
import { GlobalExceptionFilter } from './exception-filter/global.exception-filter';
import { RequestLoggerInterceptor } from './interceptor/request-logger.interceptor';

/**
 * 通用模块
 *
 * - 全局模块
 */
@Global()
@Module({
  imports: [],
  providers: [JsonResponseInterceptor, GlobalExceptionFilter, RequestLoggerInterceptor],
  exports: [],
  controllers: [HealthCheckController],
})
export class CommonModule {}
