import { Get, Controller } from '@nestjs/common';
import { Cookies } from '../decorator/cookies.decorator';
import { JsonResp } from '../decorator/json-response.decorator';

@Controller('/api')
export class HealthCheckController {
  @Get('/healthcheck')
  @JsonResp(false)
  actionHealthCheck(@Cookies() cookies: Record<string, string | undefined>): string {
    console.log('cookies: %o', cookies);
    return 'healthy';
  }
}
