import { Logger } from 'winston';
import { InjectLogger } from './decorator/inject-logger.decorator';

/**
 * 构造器类型(兼容抽象基类)
 */
type Constructor = abstract new (...args: any[]) => object;

/**
 * 混入自动上下文日志能力后的构造器类型
 */
type WithAutoContextLoggerConstructor<B extends Constructor> = abstract new (...args: any[]) => InstanceType<B> & {
  /**
   * 带当前类名上下文的日志实例
   */
  readonly logger: Logger;
};

/**
 * 实例的上下文日志实例缓存
 *
 * 以WeakMap做实例级缓存; 不使用#私有字段的原因: 泛型函数中的类表达式内使用#私有字段会触发TypeScript编译器内部错误(Lexical environment is suspended)
 */
const contextLoggerCache = new WeakMap<object, Logger>();

/**
 * 自动上下文日志混入(Mixin)
 *
 * 为任意基类附加自动上下文日志能力, 返回携带日志能力的派生基类
 *
 * TypeScript为单继承, 若类已继承其他不需要日志能力的基类, 无法再直接继承[AutoContextLogger](./auto-context-logger.ts);
 * 此时可使用本Mixin将日志能力混入其原有基类, 原基类无需做任何修改
 *
 * 通过`this.logger`访问到的日志实例自动为携带`context`为当前类名的子日志实例
 *
 * - 支持混入抽象基类
 * - 继承类的构造函数中存在其他注入参数时需显式调用`super()`; 没有构造函数或仅有日志注入时可直接删除整个构造函数
 * - 继承类中不可再声明名为`logger`的成员, 否则会覆盖自动创建的日志实例
 *
 * @example
 * ```typescript
 * class BusinessBase {}
 *
 * @Injectable()
 * class MyService extends WithAutoContextLogger(BusinessBase) {
 *   doSomething() {
 *     // this.logger自动为context为MyService的子日志实例
 *     this.logger.info('...');
 *   }
 * }
 * ```
 */
export function WithAutoContextLogger<B extends Constructor>(Base: B): WithAutoContextLoggerConstructor<B> {
  /**
   * 此处将Base断言为具体构造器类型后再extends:
   *
   * - extends抽象构造器类型的类型变量时类表达式必须声明为abstract(TS2797), 而abstract类表达式会触发TypeScript编译器内部错误(Lexical environment is suspended)
   * - 运行时extends抽象类完全合法(abstract仅为类型层面的约束), 故通过断言绕开上述编译器问题
   */
  const mixinClass = class extends (Base as unknown as new (...args: any[]) => object) {
    /**
     * 日志模块根日志实例
     *
     * 通过属性注入, 由IoC容器在实例化后自动赋值(注入元数据在类定义后手动附加); 声明在Mixin类上,
     * 依赖reflect-metadata沿类继承链查找属性注入元数据的特性
     */
    private readonly rootLogger!: Logger;

    /**
     * 带当前类名上下文的日志实例
     *
     * 首次访问时以`this.constructor.name`(运行时为实际继承类的类名)为context创建根日志实例的子实例, 并按实例缓存
     */
    protected get logger(): Logger {
      let contextLogger = contextLoggerCache.get(this);
      if (contextLogger === undefined) {
        contextLogger = this.rootLogger.child({ context: this.constructor.name });
        contextLoggerCache.set(this, contextLogger);
      }
      return contextLogger;
    }
  };
  /**
   * 手动调用属性装饰器, 等价于在类中声明@InjectLogger() private readonly rootLogger
   *
   * 不直接在类表达式中使用装饰器语法的原因: 函数作用域内的类表达式上使用装饰器会触发TypeScript编译器内部错误(Lexical environment is suspended)
   */
  InjectLogger()(mixinClass.prototype, 'rootLogger');
  return mixinClass as unknown as WithAutoContextLoggerConstructor<B>;
}

/**
 * 自动上下文日志基类
 *
 * 等价于`extends WithAutoContextLogger(class {})`, 适用于未继承其他基类的类的便捷写法;
 * 类已继承其他基类时改用[WithAutoContextLogger](#withautocontextlogger)混入
 */
export abstract class AutoContextLogger extends WithAutoContextLogger(class {}) {}
