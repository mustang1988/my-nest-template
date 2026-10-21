import { Logger } from 'winston';
import { FastifyRequest } from 'fastify';
import { ContextService } from '../../context/service/context.service';
import { InjectLogger } from '../../logger/decorator/inject-logger.decorator';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class SampleGuard implements CanActivate {
  constructor(
    private readonly ctx: ContextService,
    @InjectLogger() private readonly logger: Logger,
  ) {
    this.logger = this.logger.child({ context: this.constructor.name });
  }

  canActivate(context: ExecutionContext): boolean {
    const requestType = context.getType();
    if (requestType === 'http') {
      const httpRequest = context.switchToHttp().getRequest<FastifyRequest>();
      const isMultipart = httpRequest.isMultipart();
      this.logger.debug('[%s] isMultipart = %s', this.ctx.getRequestId(), isMultipart);
      return isMultipart;
    }
    return true;
  }
}
