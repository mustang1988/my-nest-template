# NestJS 模板项目

- [NestJS 模板项目](#nestjs-模板项目)
  - [模块说明](#模块说明)
    - [Common](#common)
      - [模块内容](#模块内容)
        - [常量](#常量)
        - [控制器](#控制器)
        - [装饰器](#装饰器)
        - [异常过滤器](#异常过滤器)
        - [拦截器](#拦截器)
    - [Configuration](#configuration)
      - [模块内容](#模块内容-1)
        - [环境变量加载工具](#环境变量加载工具)
    - [Context](#context)
      - [模块内容](#模块内容-2)
        - [服务](#服务)
    - [Logger](#logger)
      - [模块内容](#模块内容-3)
    - [MySQL](#mysql)
      - [模块内容](#模块内容-4)
        - [常量](#常量-1)
    - [Redis](#redis)
      - [模块内容](#模块内容-5)
        - [常量](#常量-2)
        - [服务](#服务-1)

## 模块说明

### Common

全局通用模块

模块目录结构

```bash
📦common
 ┣ 📂controller
 ┃ ┗ 📜health-check.controller.ts
 ┣ 📂decorator
 ┃ ┗ 📜json-response.decorator.ts
 ┣ 📂exception-filter
 ┃ ┗ 📜global.exception-filter.ts
 ┣ 📂interceptor
 ┃ ┗ 📜json-response.interceptor.ts
 ┣ 📂interface
 ┃ ┗ 📜json-response.interface.ts
 ┣ 📜common.constant.ts
 ┗ 📜common.module.ts
```

#### 模块内容

##### 常量

- [CLS_REQUEST_ID](./src/common/common.constant.ts): 请求唯一ID写入请求上下文[NodeJS Async Local Storage](https://nodejs.org/api/async_context.html)的Key
- [CLS_INSTANCE_ID](./src/common/common.constant.ts): 当前请求处理进程实例ID写入请求上下文[NodeJS Async Local Storage](https://nodejs.org/api/async_context.html)的Key

##### 控制器

[HealthCheckController](./src/common/controller/health-check.controller.ts): 健康检查接口控制器, 提供以下接口

- GET /api/healthcheck

##### 装饰器

[@JsonResp(options?:boolean)](./src/common/decorator/json-response.decorator.ts): 控制器接口函数装饰器, 用于标记Controller中的Action函数的响应内容是否为JSON

##### 异常过滤器

- [GlobalExceptionFilter](./src/common/exception-filter/global.exception-filter.ts): 全局异常过滤器, 用于全局兜底处理请求内部发生的异常, 并统一响应格式, 可处理异常包括
  - HttpException及其子类
  - JavaScript Error及其子类

##### 拦截器

- [JsonResponseInterceptor](./src/common/interceptor/json-response.interceptor.ts): JSON响应格式化拦截器, 用于统一所有接口的HTTP响应格式

### Configuration

全局配置模块

模块目录结构

```bash
📦configuration
 ┣ 📂interface
 ┃ ┣ 📜app-configuration.interface.ts
 ┃ ┣ 📜configuration.interface.ts
 ┃ ┣ 📜logger-configuration.interface.ts
 ┃ ┣ 📜mysql-configuration.interface.ts
 ┃ ┗ 📜redis-configuration.interface.ts
 ┣ 📂util
 ┃ ┗ 📜env-value-load.util.ts
 ┣ 📜configuration-loader.ts
 ┗ 📜configuration.module.ts
```

#### 模块内容

##### 环境变量加载工具

[EnvValueLoadUtil](./src/configuration/util/env-value-load.util.ts): 环境变量配置加载工具类, 提供以下静态函数用于加载环境变量配置

- loadOptionalString(): 加载指定名称的String类型`可选`环境变量
- loadRequiredString(): 加载指定名称的String类型`必须`环境变量
- loadOptionalInteger(): 加载指定名称的Integer类型`可选`环境变量
- loadRequiredInteger(): 加载指定名称的Integer类型`必须`环境变量
- loadOptionalBoolean(): 加载指定名称的Boolean类型`可选`环境变量
- loadRequiredBoolean(): 加载指定名称的Boolean类型`必须`环境变量
- loadOptionalNumber(): 加载指定名称的Number类型`可选`环境变量
- loadRequiredNumber(): 加载指定名称的Number类型`必须`环境变量

### Context

全局上下文模块

模块目录结构

```bash
📦context
 ┣ 📂service
 ┃ ┗ 📜context.service.ts
 ┗ 📜context.module.ts
```

#### 模块内容

##### 服务

[ContextService](./src/context/service/context.service.ts): 基于[NodeJS Async Local Storage](https://nodejs.org/api/async_context.html)实现的请求上下文服务, 用于获取当前请求上下文中暂存的信息, 目前提供以下功能

- getRequestId(): 获取当前请求的唯一ID; 支持上游服务通过请求头参数`x-request-id`透传, 若无上游服务透传则在收到请求后生成随机UUID作为唯一ID
- getInstanceId(): 获取当前请求处理进程的实例ID(PM2 cluster模式下分配)

### Logger

全局日志模块

模块目录结构

```bash
📦logger
 ┗ 📜logger.module.ts
```

#### 模块内容

全局日志传输器初始化, 提供以下日志传输器

- 按日切分主文件日志: 默认提供, 输出配置项`LOGGER_LEVEL`指定的级别及以上级别的日志
- 按日切分异常文件日志: 默认提供, 仅输出`ERROR`及以上级别的日志, 用于异常问题排查
- 按日切分JSON格式文件日志: 仅在配置项`LOGGER_JSON`设置为true时提供, 用于ELK等日志收集服务
- 控制台日志: 仅在配置项`LOGGER_CONSOLE`设置为true时提供

上述所有按日切分的文件日志的单日志文件大小阈值和日志滚动保留的文件数量均支持配置

### MySQL

全局MySQL数据库模块

模块目录结构

```bash
📦mysql
 ┣ 📂service
 ┃ ┗ 📜typeorm-mysql-datasource.service.ts
 ┣ 📜mysql.constant.ts
 ┗ 📜mysql.module.ts
```

#### 模块内容

##### 常量

[DEFAULT_MYSQL_DATASOURCE](./src/mysql/mysql.constant.ts): 默认MySQL数据库TypeORM的数据源依赖注入Token

### Redis

全局Redis模块

模块目录结构

```bash
📦redis
 ┣ 📂interface
 ┃ ┗ 📜redis-event-message.interface.ts
 ┣ 📂service
 ┃ ┣ 📜redis-event-emitter.service.ts
 ┃ ┗ 📜redis-event-listener.service.ts
 ┣ 📜redis.constant.ts
 ┗ 📜redis.module.ts
```

#### 模块内容

##### 常量

[DEFAULT_REDIS_CLIENT](./src/redis/redis.constant.ts): 默认Redis连接客户端对象依赖注入Token

##### 服务

[RedisEventEmitterService](./src/redis/service/redis-event-emitter.service.ts): 基于Redis发布订阅实现的事件发布服务
[RedisEventListenerService](./src/redis/service/redis-event-listener.service.ts): 基于Redis发布订阅实现的事件订阅监听服务
