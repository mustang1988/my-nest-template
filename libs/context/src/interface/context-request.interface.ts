/**
 * 上下文请求
 */
export interface ContextRequest {
  /**
   * 请求Body参数
   */
  body?: unknown;

  /**
   * 请求Query参数
   */
  query?: unknown;

  /**
   * 请求Param参数
   */
  param?: unknown;

  /**
   * 请求Header参数
   */
  header?: unknown;

  /**
   * 请求Cookie参数
   */
  cookie?: unknown;
}
