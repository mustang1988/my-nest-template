import { format } from 'node:util';
import { Logger } from '@nestjs/common';
import { ClsServiceManager } from 'nestjs-cls';
import { CLS_REQUEST_ID } from 'src/context/context.constant';
import { ContextStore } from 'src/context/interface/context-store.interface';
import { LoggingPerformanceOptions } from '../interface/logging-performance-options.interface';

/**
 * 已包装标记
 *
 * 声明在模块级供所有装饰器实例共享, 防止同一方法被多个装饰器实例重复包装(如手动叠加多个@LoggingPerformance())
 */
const WRAPPED_TAG: unique symbol = Symbol('LoggingPerformanceWrapped');

/**
 * 默认性能阈值, 50毫秒
 *
 * 注意: 此阈值针对单个函数的执行耗时, 与HTTP接口全流程性能检测的阈值(constants.performance.threshold)粒度不同, 互不沿用
 */
const DEFAULT_THRESHOLD = 50;

/**
 * 输出低性能警告日志
 *
 * 注意: 性能日志输出过程中的任何异常都不允许影响被装饰函数的执行结果, 故整体兜底捕获
 *
 * @param logger 日志实例
 * @param threshold 性能阈值(毫秒)
 * @param requestId 请求ID
 * @param beginAt 执行开始时间
 * @param args 被装饰函数的入参列表
 * @param result 被装饰函数的执行结果(或抛出的异常)
 */
const reportLowPerformance = (logger: Logger, threshold: number, requestId: string, beginAt: number, args: unknown[], result: unknown): void => {
  const duration = Math.round((performance.now() - beginAt) * 100) / 100;
  if (duration <= threshold) {
    return;
  }
  try {
    /**
     * 使用%o而非%j输出: %o基于util.inspect, 可安全处理%j无法序列化的BigInt/循环引用/抛出异常的getter等内容, 且其默认深度限制天然约束日志体积
     */
    logger.warn(
      format(
        '[%s] 低性能方法执行: %o',
        requestId,
        result instanceof Error ? { threshold, duration, args, error: result.message, stack: result.stack } : { threshold, duration, args, result },
      ),
    );
  } catch {
    /**
     * 序列化兜底: 仅输出计时信息, 不携带入参与结果
     */
    logger.warn(format('[%s] 低性能方法执行: %o', requestId, { threshold, duration }));
  }
};

/**
 * 函数执行性能日志记录装饰器
 *
 * 被装饰的函数执行耗时超过指定阈值时, 会输出WARN级别的性能日志
 *
 * - 仅支持同步函数与返回Promise的异步函数; 返回RxJS Observable等非Promise类型的方法无法安全测量(测量需订阅, 会改变执行语义), 按同步函数处理, 计时仅覆盖其同步执行部分
 * - 性能日志输出过程中的任何异常(如结果序列化失败)不会影响被装饰函数的执行结果
 * - 默认阈值针对单个函数的执行耗时, 与HTTP接口全流程性能检测的阈值(constants.performance.threshold)粒度不同, 互不沿用
 *
 * @param options 可选选项
 */
export const LoggingPerformance = (options?: LoggingPerformanceOptions): MethodDecorator => {
  return (target: object, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
    const originFunc = descriptor.value; // 被装饰成员

    // 被装饰成员不是函数, 不做处理
    if (typeof originFunc !== 'function') {
      return descriptor;
    }

    // 防重复包装不做处理(如手动叠加多个装饰器时)
    if ((originFunc as Function & { [WRAPPED_TAG]?: boolean })[WRAPPED_TAG]) {
      return descriptor;
    }

    // 选项中设置为禁用时不做处理
    if (options?.disable ?? false) {
      return descriptor;
    }

    /**
     * 以下信息在装饰时确定, 此处一次性构建, 避免被装饰函数每次调用时重复创建
     *
     * 注意: 类名取装饰时该方法所在的类(而非运行时实际调用该方法的子类), 继承调用时日志中记录的为定义该方法的类名
     */
    const className = typeof target === 'function' ? (target as Function).name : (target.constructor?.name ?? 'Unknown');
    const methodName = typeof propertyKey === 'symbol' ? (propertyKey.description ?? '') : propertyKey;
    const logger = new Logger(`${className}.${methodName}()`);
    const threshold = options?.threshold ?? DEFAULT_THRESHOLD;

    // #region 重写被装饰函数执行逻辑
    descriptor.value = function loggingPerformance(this: unknown, ...args: unknown[]) {
      /**
       * 在包装函数开头同步读取请求ID: CLS上下文在异步延续中可能已丢失
       *
       * 不在装饰时缓存CLS服务实例的原因: CLS服务由CLS模块注册时设置, 装饰时(类定义期)模块可能尚未注册; getClsService()为静态单例访问, 每次调用开销可忽略
       *
       * 无CLS上下文的调用(如未注入上下文的定时任务/队列消费)时以'-'占位
       */
      const requestId = ClsServiceManager.getClsService<ContextStore>().get(CLS_REQUEST_ID) ?? '-';
      // 记录函数开始执行时间
      const beginAt = performance.now();

      // #region 执行被装饰函数
      try {
        const originFuncReturn = originFunc.apply(this, args);
        /**
         * 按返回值(而非函数声明形式)判断异步: 非async声明但返回Promise的函数同样需等待其执行完成后再计时
         *
         * 使用thenable判断而非instanceof Promise的原因: 某些环境下存在多个realm(如Jest测试沙箱与Node内置模块各自的全局Promise构造器),
         * 跨realm的Promise实例instanceof判定为false; thenable判断无此问题, 且可覆盖任意Promise实现
         *
         * 注意: RxJS Observable等非thenable的返回值无法安全测量(测量需订阅, 会改变执行语义), 按同步函数处理, 计时仅覆盖其同步执行部分
         */
        if (
          originFuncReturn !== null &&
          typeof originFuncReturn === 'object' &&
          typeof (originFuncReturn as PromiseLike<unknown>).then === 'function'
        ) {
          return Promise.resolve(originFuncReturn).then(
            (resolved) => {
              reportLowPerformance(logger, threshold, requestId, beginAt, args, resolved);
              return resolved;
            },
            (error) => {
              reportLowPerformance(logger, threshold, requestId, beginAt, args, error);
              throw error;
            },
          );
        }
        reportLowPerformance(logger, threshold, requestId, beginAt, args, originFuncReturn);
        return originFuncReturn;
      } catch (error) {
        reportLowPerformance(logger, threshold, requestId, beginAt, args, error);
        throw error;
      }
      // #endregion
    };
    // #endregion

    // 保持原方法名与参数个数, 避免影响依赖 fn.name / fn.length 的第三方库
    Object.defineProperty(descriptor.value, 'name', { value: originFunc.name, configurable: true });
    Object.defineProperty(descriptor.value, 'length', { value: originFunc.length, configurable: true });
    // 标记已包装, 防止重复
    Object.defineProperty(descriptor.value, WRAPPED_TAG, { value: true, enumerable: false });

    return descriptor;
  };
};
