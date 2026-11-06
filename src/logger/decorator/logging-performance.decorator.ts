import { format } from 'node:util';
import { Logger } from '@nestjs/common';
import { ClsServiceManager } from 'nestjs-cls';
import { isAsyncFunction } from 'node:util/types';
import { CLS_REQUEST_ID } from 'src/context/context.constant';
import { ContextStore } from 'src/context/interface/context-store.interface';
import { LoggingPerformanceOptions } from '../interface/logging-performance-options.interface';

/**
 * 函数执行性能日志记录装饰器
 *
 * 被装饰的函数执行耗时超过指定阈值时, 会输入WARN级别的性能日志
 *
 * @param options 可选选项
 */
export const LoggingPerformance = (options?: LoggingPerformanceOptions): MethodDecorator => {
  const DEFAULT_THRESHOLD = 50; // 默认性能阈值, 50毫秒
  const TAG: unique symbol = Symbol('LoggingPerformanceWrapped');

  return (target: object, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
    const originFunc = descriptor.value; // 被装饰成员

    // 被装饰成员不是函数, 不做处理
    if (typeof originFunc !== 'function') {
      return descriptor;
    }

    // 防重复包装不做处理(类级装饰器 / 子类覆盖 / 手动叠加时)
    if ((originFunc as Function & { [TAG]?: boolean })[TAG]) {
      return descriptor;
    }

    // 选项中设置为禁用时不做处理
    if (options?.disable ?? false) {
      return descriptor;
    }

    // #region 重写被装饰函数执行逻辑
    descriptor.value = function loggingPerformance(this: unknown, ...args: unknown[]) {
      // #region logger初始化
      const className = typeof target === 'function' ? (target as Function).name : (target.constructor?.name ?? 'Unknown');
      const methodName = typeof propertyKey === 'symbol' ? (propertyKey.description ?? '') : propertyKey;
      const logger = new Logger(`${className}.${methodName}()`);
      const cls = ClsServiceManager.getClsService<ContextStore>();
      const requestId = cls.get(CLS_REQUEST_ID);
      // #endregion

      /**
       * 输出低性能日志
       * @param requestId 请求ID
       * @param beginAt 执行开始时间
       * @param args 函数入参列表
       */
      const reportLowPerformance = (requestId: string, beginAt: number, args: unknown[], result: unknown) => {
        const duration = Math.round((performance.now() - beginAt) * 100) / 100;
        const threshold = options?.threshold ?? DEFAULT_THRESHOLD;
        if (threshold < duration) {
          let message: string;
          const messageFormat = '[%s] 低性能方法执行: %j';
          if (result instanceof Error) {
            message = format(messageFormat, requestId, { threshold, duration, args, error: result.message, stack: result.stack });
          } else {
            message = format(messageFormat, requestId, { threshold, duration, args, result });
          }
          logger.warn(message);
        }
      };

      // 记录函数开始执行时间
      const beginAt = performance.now();

      // #region 执行被装饰函数
      try {
        if (isAsyncFunction(originFunc)) {
          // 被装饰函数是async函数
          return Promise.resolve(originFunc.apply(this, args)).then(
            (originFuncReturn) => {
              reportLowPerformance(requestId, beginAt, args, originFuncReturn);
              return originFuncReturn;
            },
            (error) => {
              reportLowPerformance(requestId, beginAt, args, error);
              throw error;
            },
          );
        }

        // 被装饰函数是同步函数
        const originFuncReturn = originFunc.apply(this, args);
        reportLowPerformance(requestId, beginAt, args, originFuncReturn);
        return originFuncReturn;
      } catch (error) {
        reportLowPerformance(requestId, beginAt, args, error);
        throw error;
      }
      // #endregion
    };
    // #endregion

    // 保持原方法名与 arity, 避免影响依赖 fn.name / fn.length 的第三方库
    Object.defineProperty(descriptor.value, 'name', { value: originFunc.name, configurable: true });
    // 标记已包装, 防止重复
    Object.defineProperty(descriptor.value, TAG, { value: true, enumerable: false });

    return descriptor;
  };
};
