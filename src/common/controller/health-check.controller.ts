import { Get, Controller } from '@nestjs/common';
import { JsonResp } from '../decorator/json-response.decorator';

@Controller('/api')
export class HealthCheckController {
  @Get('/healthcheck')
  @JsonResp(false)
  actionHealthCheck(): string {
    return 'healthy';
  }
}
