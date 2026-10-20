import {
  CLS_REQUEST_ID,
  CLS_INSTANCE_ID,
  CLS_HTTP_BODY,
  CLS_HTTP_PARAM,
  CLS_HTTP_QUERY,
  CLS_HTTP_COOKIE,
  CLS_HTTP_HEADER,
} from '../context.constant';
import { CLS_CTX, ClsService, InjectCls } from 'nestjs-cls';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { ContextStore } from '../interface/context-store.interface';
import { ContextRequest } from '../interface/context-request.interface';

/**
 * 上下文服务
 *
 * CLS的封装, 项目中不建议通过@InjectCls()来注入CLS提供的上下文服务而是注入本类的实例
 */
@Injectable()
export class ContextService {
  constructor(@InjectCls() private readonly cls: ClsService<ContextStore>) {}

  getCls(): ClsService<ContextStore> {
    return this.cls;
  }

  /**
   * 获取所有上下文参数
   * @return 所有上下文参数
   */
  getAll(): ContextStore {
    return this.cls.get();
  }

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

  getExecutionContext(): ExecutionContext {
    return this.cls.get(CLS_CTX);
  }

  /**
   * 从上下文中获取当前请求参数
   * @return 请求参数
   */
  getRequest(): ContextRequest {
    return {
      body: this.cls.get(CLS_HTTP_BODY),
      query: this.cls.get(CLS_HTTP_QUERY),
      param: this.cls.get(CLS_HTTP_PARAM),
      header: this.cls.get(CLS_HTTP_HEADER),
      cookie: this.cls.get(CLS_HTTP_COOKIE),
    };
  }

  /**
   * 从上下文中获取当前请求Body参数
   * @return 请求Body参数
   */
  getRequestBody(): undefined | unknown {
    return this.cls.get(CLS_HTTP_BODY);
  }

  /**
   * 从上下文中获取当前请求Param参数
   * @return 请求Param参数
   */
  getRequestParam(): undefined | unknown {
    return this.cls.get(CLS_HTTP_PARAM);
  }

  /**
   * 从上下文中获取当前请求Query参数
   * @return 请求Query参数
   */
  getRequestQuery(): undefined | unknown {
    return this.cls.get(CLS_HTTP_QUERY);
  }

  /**
   * 从上下文中获取当前请求Header参数
   * @return 请求Header参数
   */
  getRequestHeader(): undefined | unknown {
    return this.cls.get(CLS_HTTP_HEADER);
  }

  /**
   * 从上下文中获取当前请求Cookie参数
   * @return 请求Cookie参数
   */
  getRequestCookie(): undefined | unknown {
    return this.cls.get(CLS_HTTP_COOKIE);
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
