import { Observable, tap } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { FastifyRequest } from 'fastify';
import { DataMaskingUtil } from '../util/data-masking.util';
import { JsonResp } from '../decorator/json-response.decorator';
import { ContextService } from '../../context/service/context.service';
import { AutoContextLogger } from '../../logger/auto-context-logger';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';

/**
 * 请求参数日志拦截器
 *
 * 用于在日志中输出每次请求的参数
 *
 * 建议在开发调试阶段使用
 */
@Injectable()
export class RequestLoggerInterceptor extends AutoContextLogger implements NestInterceptor {
  constructor(
    private readonly ctx: ContextService,
    private readonly reflector: Reflector,
  ) {
    super();
  }

  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const requestId = this.ctx.getRequestId();
    const controller = context.getClass().name;
    const action = context.getHandler().name;
    const isJsonResp = this.reflector.get(JsonResp, context.getHandler()) ?? true;
    const { method, url, params, query, body } = request;
    /**
     * 敏感请求头脱敏后输出
     */
    const maskedHeaders = DataMaskingUtil.maskingObject(request.headers, { fields: ['authorization', 'cookie'] });
    this.logger.debug(
      '[%s] 收到HTTP请求: method = %s, url = %s, headers = %j, params = %j, query = %j, body = %j, controller = %s, action = %s',
      requestId,
      method,
      url,
      maskedHeaders,
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
