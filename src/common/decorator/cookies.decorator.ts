import { FastifyRequest } from 'fastify';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * `@Cookies()`装饰器注解
 *
 * 用于在Controller的Action函数中获取请求的Cookie参数
 */
export const Cookies = createParamDecorator<string, string | undefined | Record<string, string | undefined>>(
  (data: string, context: ExecutionContext): string | undefined | Record<string, string | undefined> => {
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    return data ? request.cookies?.[data] : request.cookies;
  },
);
