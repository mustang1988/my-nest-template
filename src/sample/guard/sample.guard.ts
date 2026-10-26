import { FastifyRequest } from 'fastify';
import { ContextService } from '../../context/service/context.service';
import { AutoContextLogger } from '../../logger/auto-context-logger';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class SampleGuard extends AutoContextLogger implements CanActivate {
  constructor(private readonly ctx: ContextService) {
    super();
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
