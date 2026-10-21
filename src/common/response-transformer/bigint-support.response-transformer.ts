import { parse as jsonBigintParse } from 'json-bigint';
import { AxiosResponseHeaders, AxiosResponseTransformer, InternalAxiosRequestConfig } from 'axios';

/**
 * 支持Bigint的 axios 响应转换器
 *
 * 当外部API响应的JSON内容中的字段值有Bigint数值时, 可配置此转换器以避免Bigint值丢失精度
 *
 * @example
 * ```typescript
 * // app.module.ts
 *
 * HttpModule.register({ global: true, timeout: ms('5min'), transformResponse: [BigintSupportResponseTransformer] })
 *
 * ```
 */
export const BigintSupportResponseTransformer: AxiosResponseTransformer = function (
  this: InternalAxiosRequestConfig,
  data: any,
  headers: AxiosResponseHeaders,
  // status?: number,
) {
  if (headers['Content-Type']?.toString()?.includes('application/json') && typeof data === 'string') {
    try {
      return jsonBigintParse(data);
    } catch {
      return data; // 异常时返回原值
    }
  }
  return data; // 非json响应时返回原值
};
