import { randomUUID } from 'node:crypto';
import { IncomingMessage } from 'node:http';
import { Global, Module } from '@nestjs/common';
import { ClsModule, type ClsService } from 'nestjs-cls';
import { ContextService } from './service/context.service';
import { CLS_INSTANCE_ID, CLS_REQUEST_ID } from './context.constant';

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
        setup: (cls: ClsService, req: IncomingMessage) => {
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
    }),
  ],
  providers: [ContextService],
  exports: [ContextService],
})
export class ContextModule {}
