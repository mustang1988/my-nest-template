import {
  CLS_REQUEST_ID,
  CLS_INSTANCE_ID,
  CLS_HTTP_BODY,
  CLS_HTTP_PARAM,
  CLS_HTTP_QUERY,
  CLS_HTTP_COOKIE,
  CLS_HTTP_HEADER,
} from '../context.constant';
import { ClsStore } from 'nestjs-cls';

/**
 * 上下文Store
 */
export interface ContextStore extends ClsStore {
  [CLS_REQUEST_ID]?: string;
  [CLS_INSTANCE_ID]?: number;
  [CLS_HTTP_BODY]?: unknown;
  [CLS_HTTP_QUERY]?: unknown;
  [CLS_HTTP_PARAM]?: unknown;
  [CLS_HTTP_HEADER]?: unknown;
  [CLS_HTTP_COOKIE]?: unknown;
}
