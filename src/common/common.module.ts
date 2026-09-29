import { Global, Module } from '@nestjs/common';
import { HealthCheckController } from './controller/health-check.controller';
import { JsonResponseInterceptor } from './interceptor/json-response.interceptor';
import { GlobalExceptionFilter } from './exception-filter/global.exception-filter';

@Global()
@Module({
  imports: [],
  providers: [JsonResponseInterceptor, GlobalExceptionFilter],
  exports: [],
  controllers: [HealthCheckController],
})
export class CommonModule {}
