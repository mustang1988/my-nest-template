import {
  CLS_HTTP_BODY,
  CLS_REQUEST_ID,
  CLS_HTTP_PARAM,
  CLS_HTTP_QUERY,
  CLS_INSTANCE_ID,
  CLS_HTTP_COOKIE,
  CLS_HTTP_HEADER,
} from '../context.constant';
import { ClsStore } from 'nestjs-cls';

/**
 * 上下文Store
 */
export interface ContextStore extends ClsStore {
  /**
   * 请求唯一ID
   */
  [CLS_REQUEST_ID]?: string;

  /**
   * 请求处理的实例ID
   */
  [CLS_INSTANCE_ID]?: number;

  /**
   * 请求Body参数
   */
  [CLS_HTTP_BODY]?: unknown;

  /**
   * 请求Query参数
   */
  [CLS_HTTP_QUERY]?: unknown;

  /**
   * 请求Param参数
   */
  [CLS_HTTP_PARAM]?: unknown;

  /**
   * 请求Header参数
   */
  [CLS_HTTP_HEADER]?: unknown;

  /**
   * 请求Cookie参数
   */
  [CLS_HTTP_COOKIE]?: unknown;
}
