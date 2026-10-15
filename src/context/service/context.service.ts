import { Injectable } from '@nestjs/common';
import { ClsService, InjectCls } from 'nestjs-cls';
import { CLS_INSTANCE_ID, CLS_REQUEST_ID } from '../context.constant';

/**
 * 上下文服务
 */
@Injectable()
export class ContextService {
  constructor(@InjectCls() private readonly cls: ClsService) {}

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

  /**
   * 从上下文中获取指定key的值
   * @param key
   * @returns
   */
  getCtxValue<T>(key: string | symbol): T | undefined {
    return this.cls.get(key);
  }

  /**
   * 在上下文中设置指定key的值, 若指定key在上下文中有值, 则使用提交的value覆盖原值
   * @param key
   * @param value
   */
  setCtxValue<T>(key: string | symbol, value: T): void {
    this.cls.set(key, value);
  }

  /**
   * 在上下文中设置指定key的值, 仅在指定key在上下文中未设置值时才设置, 若有值则不会覆盖原有值
   * @param key
   * @param value
   * @return 是否成功设置值
   */
  setCtxValueIfUndefined<T>(key: string | symbol, value: T): boolean {
    return this.cls.setIfUndefined(key, value);
  }
}
