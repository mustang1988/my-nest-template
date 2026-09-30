import { ClsService } from 'nestjs-cls';
import { Inject, Injectable } from '@nestjs/common';
import { CLS_INSTANCE_ID, CLS_REQUEST_ID } from '../../common/common.constant';

/**
 * 上下文服务
 */
@Injectable()
export class ContextService {
  constructor(@Inject() private readonly cls: ClsService) {}

  /**
   * 从上下文中获取本次请求的唯一ID
   * @return 本次请求的唯一ID
   */
  getRequestId(): string {
    return this.cls.get<string>(CLS_REQUEST_ID);
  }

  /**
   * 从上下文中获取当前实例ID
   * @return 当前实例ID
   */
  getInstanceId(): number {
    return this.cls.get<number>(CLS_INSTANCE_ID);
  }
}
