import { get } from 'lodash';
import { Logger } from 'winston';
import { ClsService } from 'nestjs-cls';
import { CLS_REQUEST_ID } from '../common.constant';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { FastifyReply, FastifyRequest } from 'fastify';
import { IJsonResponse } from '../interface/json-response.interface';
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Inject, Injectable } from '@nestjs/common';

@Injectable()
@Catch(HttpException, Error)
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject() private readonly cls: ClsService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {
    this.logger = this.logger.child({ context: this.constructor.name });
  }

  catch(exception: HttpException | Error, host: ArgumentsHost) {
    const request = host.switchToHttp().getRequest<FastifyRequest>();
    const response = host.switchToHttp().getResponse<FastifyReply>();
    const requestId = this.cls.get(CLS_REQUEST_ID);
    const errorMessage = exception instanceof HttpException ? get(exception, 'response.message', '') : exception.message;
    const statusCode = exception instanceof HttpException ? (exception.getStatus() ?? 500) : 500;
    const { method, url, query, params, body, headers } = request;
    this.logger.error('[%s] %o', requestId, exception);
    const formatedResp: IJsonResponse<undefined> = {
      requestId,
      status: 'error',
      code: statusCode,
      timestamp: Date.now(),
      data: undefined,
      error: errorMessage,
      request: { method, url, query, params, body, headers },
    };
    response.code(statusCode).send(formatedResp);
  }
}
