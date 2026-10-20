import { randomUUID } from 'node:crypto';
import { FastifyRequest } from 'fastify';
import { IncomingMessage } from 'node:http';
import { ClsModule, ClsService } from 'nestjs-cls';
import { ContextService } from './service/context.service';
import { ExecutionContext, Global, Module } from '@nestjs/common';
import { ContextStore } from './interface/context-store.interface';
import { CLS_REQUEST_ID, CLS_INSTANCE_ID, CLS_HTTP_BODY, CLS_HTTP_PARAM, CLS_HTTP_QUERY, CLS_HTTP_COOKIE, CLS_HTTP_HEADER } from './context.constant';

/**
 * 上下文模块
 *
 * - 全局模块
 */
@Global()
@Module({
  imports: [
    ClsModule.forRoot({
      global: true,
      /**
       * 在所有路由上全局挂载中间件
       *
       * 此中间件会在每次收到请求时创建一个[AsyncLocalStorage](https://nodejs.org/api/async_context.html#async_context_class_asynclocalstorage)上下文
       *
       * 用来存储本次请求的上下文数据, 其中的存入的数据只可以在本次请求的函数调用链上访问, 请求结束后自动销毁
       *
       * @see https://papooch.github.io/nestjs-cls/
       */
      middleware: {
        mount: true,
        debug: false,
        saveReq: false, // 不存储请请求参数到上下文, 该存入的请求参数为HTTP协议底层的IncomingMessage, 非FastifyRequest或ExpressRequst其中很多请求参数无法获取
        saveRes: false, // 不存储响应结果到上下文, 绝大部分场景下用不到
        setup: (cls: ClsService<ContextStore>, req: IncomingMessage) => {
          /**
           * 本次请求ID创建
           *
           * - 如果请求头中有x-request-id则优先使用此值作为请求ID, 可用于跨服务请求ID追踪
           * - 其次创建随机UUID作为本次请求ID
           */
          const requestId = (req.headers['x-request-id'] as string) ?? randomUUID();
          /**
           * 将本次请求ID存入上下文
           */
          cls.setIfUndefined(CLS_REQUEST_ID, requestId);
          /**
           * 将当前实例ID存入上下文
           */
          cls.setIfUndefined(CLS_INSTANCE_ID, Number(process.env.INSTANCE_ID ?? 0));
        },
      },
      /**
       * 在所有理由全局挂载守卫
       *
       * 此守卫会在每次收到请求时, 将请求的Body, Query, Param, Header和Cookie参数写入到中间件创建的上下文中
       */
      guard: {
        mount: true,
        saveCtx: true, // 上下文中记录 ExecutionContext
        setup: (cls: ClsService, context: ExecutionContext) => {
          const contextType = context.getType();
          /**
           * HTTP请求将请求参数存入CLS上下文
           */
          if (contextType === 'http') {
            const httpRequest = context.switchToHttp().getRequest<FastifyRequest>();
            cls.setIfUndefined(CLS_HTTP_BODY, httpRequest.body);
            cls.setIfUndefined(CLS_HTTP_QUERY, httpRequest.query);
            cls.setIfUndefined(CLS_HTTP_PARAM, httpRequest.params);
            cls.setIfUndefined(CLS_HTTP_HEADER, httpRequest.headers);
            cls.setIfUndefined(CLS_HTTP_COOKIE, httpRequest.cookies);
          }
        },
      },
    }),
  ],
  providers: [ContextService],
  exports: [ContextService],
})
export class ContextModule {}
