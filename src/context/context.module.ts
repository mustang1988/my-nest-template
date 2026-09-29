import { randomUUID } from 'node:crypto';
import { IncomingMessage } from 'node:http';
import { Global, Module } from '@nestjs/common';
import { ClsModule, type ClsService } from 'nestjs-cls';
import { ContextService } from './service/context.service';
import { CLS_REQUEST_ID } from '../common/common.constant';

@Global()
@Module({
  imports: [
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
        debug: true,
        setup: (cls: ClsService, req: IncomingMessage) => {
          const requestId = (req.headers['x-request-id'] as string) ?? randomUUID();
          cls.setIfUndefined(CLS_REQUEST_ID, requestId);
        },
        saveReq: false,
        saveRes: false,
      },
    }),
  ],
  providers: [ContextService],
  exports: [ContextService],
})
export class ContextModule {}
