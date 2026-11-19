import { Reflector } from '@nestjs/core';

/**
 * `@JsonResp()`装饰器注解
 *
 * 用于标记Controller中的Action函数的响应内容是否为JSON;
 *
 * `@JsonResp(false)`装饰的Action函数的返回值既响应内容, 不会被[JsonResponseInterceptor](../interceptor/json-response.interceptor.ts)处理
 */
export const JsonResp = Reflector.createDecorator<boolean>();
