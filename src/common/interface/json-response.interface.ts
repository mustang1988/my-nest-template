/**
 * 统一JSON响应格式
 */
export interface IJsonResponse<T> {
  /**
   * 本次请求的唯一ID
   */
  requestId: string;

  /**
   * 响应状态
   *
   * - success: 成功
   * - error: 异常
   */
  status: 'success' | 'error';

  /**
   * HTTP状态码
   */
  code: number;

  /**
   * 响应时的服务器时间戳
   */
  timestamp: number;

  /**
   * 响应内容
   */
  data: T;

  /**
   * 异常信息
   *
   * 仅在异常响应中返回
   */
  error?: string;

  /**
   * 所有请求参数
   *
   * 仅在异常响应中返回, 用于复现异常请求
   */
  request?: unknown;
}
