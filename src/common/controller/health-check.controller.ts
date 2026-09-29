import { Get, Controller } from '@nestjs/common';

@Controller('/api')
export class HealthCheckController {
  @Get('/healthcheck')
  actionHealthCheck(): string {
    return 'healthy';
  }
}
