/**
 * 已包装标记
 *
 * 声明在模块级供所有装饰器实例共享, 防止同一方法被多个装饰器实例重复包装(如手动叠加多个@LoggingPerformance())
 */
export const WRAPPED_TAG: unique symbol = Symbol('LoggingPerformanceWrapped');
