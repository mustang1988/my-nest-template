import { parse as jsonBigintParse } from 'json-bigint';
import { AxiosResponseHeaders, AxiosResponseTransformer, InternalAxiosRequestConfig } from 'axios';

/**
 * 支持Bigint的 axios 响应转换器
 *
 * 当外部HTTP-API响应的JSON内容中的字段值有Bigint数值时, 可配置此转换器以避免Bigint值丢失精度
 *
 * @example
 * ```typescript
 * // app.module.ts
 * HttpModule.register({ global: true, timeout: ms('5min'), transformResponse: [BigintSupportResponseTransformer] })
 * ```
 */
export const BigintSupportResponseTransformer: AxiosResponseTransformer = function (
  this: InternalAxiosRequestConfig,
  data: unknown,
  headers: AxiosResponseHeaders,
  // status?: number,
) {
  if (headers.getContentType()?.includes('application/json') && typeof data === 'string' && data !== '' /* 空响应body不做处理, 原样返回 */) {
    try {
      /**
       * 仅处理同时满足以下条件的请求响应
       * 1. 响应头中Content-Type包含application/json
       * 2. 响应body内容为字符串
       * 3. 响应body内容非空字符串
       */
      return jsonBigintParse(data);
    } catch {
      /**
       * HTTP响应头中Content-Type包含application/json, 但响应body实际并不是json格式字符串, 会进入此cache
       * 本示例项目中/api/sample/raw接口可用于测试此种情况
       */
      return data;
    }
  }
  return data; // 不满足处理条件的响应不做处理
};
