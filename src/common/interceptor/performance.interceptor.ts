import { Logger } from 'winston';
import { Observable, tap } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { ContextService } from '../../context/service/context.service';
import { InjectLogger } from '../../logger/decorator/inject-logger.decorator';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';

/**
 * 性能指标拦截器
 */
@Injectable()
export class PerformanceInterceptor implements NestInterceptor {
  constructor(
    private readonly ctx: ContextService,
    private readonly configService: ConfigService,
    @InjectLogger() private readonly logger: Logger,
  ) {
    this.logger = this.logger.child({ context: this.constructor.name });
  }

  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    const performanceThreshold = this.configService.getOrThrow<number>('constants.performance.threshold');
    const requestId = this.ctx.getRequestId();
    const beginAt = Date.now();
    return next.handle().pipe(
      tap(() => {
        const endAt = Date.now();
        const duration = endAt - beginAt;
        if (duration > performanceThreshold) {
          this.logger.warn('[%s] 请求处理性能过低: duration = %s, performanceThreshold = %s', requestId, duration, performanceThreshold);
        }
      }),
    );
  }
}
