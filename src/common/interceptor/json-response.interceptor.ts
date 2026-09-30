import { map, Observable } from 'rxjs';
import { FastifyReply } from 'fastify';
import { ClsService } from 'nestjs-cls';
import { Reflector } from '@nestjs/core';
import { CLS_REQUEST_ID } from '../common.constant';
import { JsonResp } from '../decorator/json-response.decorator';
import { IJsonResponse } from '../interface/json-response.interface';
import { Inject, Injectable, CallHandler, NestInterceptor, ExecutionContext } from '@nestjs/common';

/**
 * JSON响应格式化拦截器
 *
 * 用于统一所有接口的HTTP响应格式
 *
 * 注意: 本拦截器不处理发生异常时的响应, 异常响应格式化见: [GlobalExceptionFilter](../exception-filter/global.exception-filter.ts)
 */
@Injectable()
export class JsonResponseInterceptor implements NestInterceptor {
  constructor(
    @Inject() private readonly cls: ClsService,
    @Inject() private readonly reflector: Reflector,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    const requestId = this.cls.get<string>(CLS_REQUEST_ID);
    const response = context.switchToHttp().getResponse<FastifyReply>();
    const isJsonResponse = this.reflector.get(JsonResp, context.getHandler()) ?? true;
    return next.handle().pipe(
      map((controllerReturnData: unknown) => {
        if (!isJsonResponse) {
          return controllerReturnData;
        }
        const formatedResp: IJsonResponse<unknown> = {
          requestId,
          status: response.statusCode >= 200 && response.statusCode < 300 ? 'success' : 'error',
          code: response.statusCode,
          timestamp: Date.now(),
          data: controllerReturnData,
          error: undefined,
          request: undefined,
        };
        return formatedResp;
      }),
    );
  }
}
