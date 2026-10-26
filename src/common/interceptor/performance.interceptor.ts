import { Observable, tap } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { ContextService } from '../../context/service/context.service';
import { AutoContextLogger } from '../../logger/auto-context-logger';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';

/**
 * 性能指标拦截器
 */
@Injectable()
export class PerformanceInterceptor extends AutoContextLogger implements NestInterceptor {
  constructor(
    private readonly ctx: ContextService,
    private readonly configService: ConfigService,
  ) {
    super();
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
