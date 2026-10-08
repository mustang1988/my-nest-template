import { randomUUID } from 'node:crypto';
import { IncomingMessage } from 'node:http';
import { Global, Module } from '@nestjs/common';
import { ClsModule, type ClsService } from 'nestjs-cls';
import { ContextService } from './service/context.service';
import { CLS_INSTANCE_ID, CLS_REQUEST_ID } from '../common/common.constant';

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
      middleware: {
        mount: true,
        debug: false,
        saveReq: false,
        saveRes: false,
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
