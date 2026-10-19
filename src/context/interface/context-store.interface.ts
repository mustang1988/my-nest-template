import {
  CLS_REQUEST_ID,
  CLS_INSTANCE_ID,
  CLS_REQUEST_BODY,
  CLS_REQUEST_PARAM,
  CLS_REQUEST_QUERY,
  CLS_REQUEST_COOKIE,
  CLS_REQUEST_HEADER,
} from '../context.constant';
import { ClsStore } from 'nestjs-cls';

/**
 * 上下文Store
 */
export interface ContextStore extends ClsStore {
  [CLS_REQUEST_ID]?: string;
  [CLS_INSTANCE_ID]?: number;
  [CLS_REQUEST_BODY]?: unknown;
  [CLS_REQUEST_QUERY]?: unknown;
  [CLS_REQUEST_PARAM]?: unknown;
  [CLS_REQUEST_HEADER]?: unknown;
  [CLS_REQUEST_COOKIE]?: unknown;
}
