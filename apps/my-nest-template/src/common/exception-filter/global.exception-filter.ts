import { get } from 'lodash';
import { Logger } from 'winston';
import { I18nValidationException } from 'nestjs-i18n';
import { FastifyReply, FastifyRequest } from 'fastify';
import { IJsonResponse } from '../interface/json-response.interface';
import { ContextService } from '../../context/service/context.service';
import { InjectLogger } from '../../logger/decorator/inject-logger.decorator';
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Injectable } from '@nestjs/common';

/**
 * 全局异常过滤器
 *
 * 用于全局兜底处理请求内部发生的异常, 并统一响应格式, 可处理异常包括
 * - HttpException及其子类
 * - JavaScript Error及其子类
 */
@Injectable()
@Catch(HttpException, Error)
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly ctx: ContextService,
    @InjectLogger() private readonly logger: Logger,
  ) {
    this.logger = this.logger.child({ context: this.constructor.name });
  }

  catch(exception: HttpException | Error, host: ArgumentsHost) {
    const request = host.switchToHttp().getRequest<FastifyRequest>();
    const response = host.switchToHttp().getResponse<FastifyReply>();
    const requestId = this.ctx.getRequestId();
    const instanceId = this.ctx.getInstanceId();
    const errorMessage =
      exception instanceof I18nValidationException
        ? /**
           * DTO参数校验Exception信息
           */
          exception.errors.map((err) => Object.values(err.constraints as Record<string, string>))
        : exception instanceof HttpException
          ? /**
             * 其他Exception信息
             *
             * getResponse()返回值可能是字符串(如new HttpException('msg', code))或包含message字段的对象
             */
            typeof exception.getResponse() === 'string'
            ? exception.getResponse()
            : (get(exception.getResponse(), 'message') ?? exception.message)
          : /**
             * Error信息
             */
            exception.message;
    const statusCode = exception instanceof HttpException ? exception.getStatus() : 500;
    const { method, url, query, params, body } = request;
    this.logger.error('[%s] %o', requestId, exception);
    const formatedResp: IJsonResponse<undefined> = {
      requestId,
      status: 'error',
      code: statusCode,
      timestamp: Date.now(),
      data: undefined,
      error: errorMessage,
      /**
       * 注意: 不回显请求headers, 其中可能包含Authorization/Cookie等敏感信息
       */
      request: { method, url, query, params, body },
      instanceId,
    };
    response.code(statusCode).send(formatedResp);
  }
}
