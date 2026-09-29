import { ClsService } from 'nestjs-cls';
import { Inject, Injectable } from '@nestjs/common';
import { CLS_REQUEST_ID } from '../../common/common.constant';

@Injectable()
export class ContextService {
  constructor(@Inject() private readonly cls: ClsService) {}

  getRequestId(): string {
    return this.cls.get<string>(CLS_REQUEST_ID);
  }
}
