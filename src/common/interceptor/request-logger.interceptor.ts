import { Logger } from 'winston';
import { Observable, tap } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { FastifyRequest } from 'fastify';
import { JsonResp } from '../decorator/json-response.decorator';
import { ContextService } from '../../context/service/context.service';
import { InjectLogger } from '../../logger/decorator/inject-logger.decorator';
import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from '@nestjs/common';

/**
 * 请求参数日志拦截器
 *
 * 用于在日志中输出每次请求的参数
 *
 * 建议在开发调试阶段使用
 */
@Injectable()
export class RequestLoggerInterceptor implements NestInterceptor {
  constructor(
    @Inject() private readonly ctx: ContextService,
    @Inject() private readonly reflector: Reflector,
    @InjectLogger() private readonly logger: Logger,
  ) {
    this.logger = this.logger.child({ context: this.constructor.name });
  }

  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const requestId = this.ctx.getRequestId();
    const controller = context.getClass().name;
    const action = context.getHandler().name;
    const isJsonResp = this.reflector.get(JsonResp, context.getHandler()) ?? true;
    const { method, url, headers, params, query, body } = request;
    this.logger.debug(
      '[%s] 收到HTTP请求: method = %s, url = %s, headers = %j, params = %j, query = %j, body = %j, controller = %s, action = %s',
      requestId,
      method,
      url,
      headers,
      params,
      query,
      body,
      controller,
      action,
    );
    return next.handle().pipe(
      tap((actionReturn) => {
        if (isJsonResp) {
          this.logger.debug('[%s] 响应HTTP请求, JSON响应: actionReturn = %j', requestId, actionReturn);
        } else {
          this.logger.debug('[%s] 响应HTTP请求, 非JSON响应: actionReturn = %o', requestId, actionReturn);
        }
      }),
    );
  }
}
