import { Global, Module } from '@nestjs/common';
import { HealthCheckController } from './controller/health-check.controller';
import { JsonResponseInterceptor } from './interceptor/json-response.interceptor';
import { GlobalExceptionFilter } from './exception-filter/global.exception-filter';

/**
 * 通用模块
 *
 * - 全局模块
 */
@Global()
@Module({
  imports: [],
  providers: [JsonResponseInterceptor, GlobalExceptionFilter],
  exports: [],
  controllers: [HealthCheckController],
})
export class CommonModule {}
