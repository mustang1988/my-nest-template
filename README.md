# NestJS 模板项目

- [NestJS 模板项目](#nestjs-模板项目)
  - [项目配置](#项目配置)
  - [模块说明](#模块说明)
    - [Common](#common)
      - [模块内容](#模块内容)
    - [Configuration](#configuration)
      - [模块内容](#模块内容-1)
    - [Context](#context)
      - [模块内容](#模块内容-2)
    - [Event](#event)
      - [模块内容](#模块内容-3)
    - [Logger](#logger)
      - [模块内容](#模块内容-4)
    - [MySQL](#mysql)
      - [模块内容](#模块内容-5)
    - [Redis](#redis)
      - [模块内容](#模块内容-6)
    - [Internationalization](#internationalization)
      - [模块内容](#模块内容-7)
    - [Rabbitmq](#rabbitmq)
      - [模块内容](#模块内容-8)
    - [S3-Storage](#s3-storage)
      - [模块内容](#模块内容-9)
    - [Sample](#sample)

## 项目配置

[全量配置示例&配置项说明](./.env)

## 模块说明

### Common

全局通用模块

模块目录结构

```bash
📦common
 ┣ 📂controller
 ┃ ┗ 📜health-check.controller.ts
 ┣ 📂decorator
 ┃ ┣ 📜cookies.decorator.ts
 ┃ ┗ 📜json-response.decorator.ts
 ┣ 📂exception-filter
 ┃ ┗ 📜global.exception-filter.ts
 ┣ 📂interceptor
 ┃ ┣ 📜json-response.interceptor.ts
 ┃ ┣ 📜performance.interceptor.ts
 ┃ ┗ 📜request-logger.interceptor.ts
 ┣ 📂interface
 ┃ ┣ 📜common-module-options.interface.ts
 ┃ ┣ 📜data-masking-options.interface.ts
 ┃ ┣ 📜health-check-result.interface.ts
 ┃ ┗ 📜json-response.interface.ts
 ┣ 📂util
 ┃ ┗ 📜data-masking.util.ts
 ┗ 📜common.module.ts
```

#### 模块内容

|                                                                                        | 类型      | 说明                                                                       |
| -------------------------------------------------------------------------------------: | :-------- | :------------------------------------------------------------------------- |
|                             [DataMaskingUtil](./src//common/util/data-masking.util.ts) | class     | 数据脱敏工具类; 可用于对字符串类型敏感数据(例如密码)进行数据脱敏           |
|                     [IJsonResponse](./src/common/interface/json-response.interface.ts) | interface | 统一JSON响应格式                                                           |
|                  [@Cookies(name?:string)](./src/common/decorator/cookies.decorator.ts) | decorator | 控制器接口函数装饰器, 用于获取请求的Cookie参数                             |
|            [HealthCheckController](./src/common/controller/health-check.controller.ts) | class     | 健康检查接口控制器                                                         |
|          [IHealthCheckResult](./src/common/interface/health-check-result.interface.ts) | interface | 健康检查结果                                                               |
|          [PerformanceInterseptor](./src/common/interceptor/performance.interceptor.ts) | class     | 性能指标拦截器; 当接口耗时超过指定哦可配置阈值时, 输出WARN级别日志         |
|        [IDataMaskingOptions](./src/common/interface/data-masking-options.interface.ts) | interface | 数据脱敏选项                                                               |
|       [@JsonResp(options?:boolean)](./src/common/decorator/json-response.decorator.ts) | decorator | 控制器接口函数装饰器, 用于标记Controller中的Action函数的响应内容是否为JSON |
|       [JsonResponseInterceptor](./src/common/interceptor/json-response.interceptor.ts) | class     | JSON响应格式化拦截器, 用于统一所有接口的HTTP响应格式                       |
|      [GlobalExceptionFilter](./src/common/exception-filter/global.exception-filter.ts) | class     | 全局异常过滤器, 用于全局兜底处理请求内部发生的异常, 并统一响应格式         |
|     [RequestLoggerInterceptor](./src/common/interceptor/request-logger.interceptor.ts) | class     | 请求参数日志拦截器, 用于在日志中输出每次请求的参数, 建议在开发调试阶段使用 |
| [ICommonModuleAsyncOptions](./src/common/interface/common-module-options.interface.ts) | interface | 通用动态模块初始化选项                                                     |

### Configuration

全局配置模块

模块目录结构

```bash
📦configuration
 ┣ 📂interface
 ┃ ┣ 📜app-configuration.interface.ts
 ┃ ┣ 📜configuration.interface.ts
 ┃ ┣ 📜i18n-configuration.interface.ts
 ┃ ┣ 📜logger-configuration.interface.ts
 ┃ ┣ 📜mysql-configuration.interface.ts
 ┃ ┣ 📜rabbitmq-configuration.interface.ts
 ┃ ┣ 📜redis-configuration.interface.ts
 ┃ ┗ 📜s3-storage.interface.ts
 ┣ 📂util
 ┃ ┗ 📜env-value-load.util.ts
 ┣ 📜configuration-loader.ts
 ┗ 📜configuration.module.ts
```

#### 模块内容

|                                                                                             | 类型      | 说明                                                         |
| ------------------------------------------------------------------------------------------: | :-------- | :----------------------------------------------------------- |
|                         [EnvValueLoadUtil](./src/configuration/util/env-value-load.util.ts) | class     | 环境变量配置加载工具类, 提供以下静态函数用于加载环境变量配置 |
|                      [configuration-loader.ts](./src/configuration/configuration-loader.ts) | function  | 项目配置加载函数                                             |
|                  [IConfiguration](./src/configuration/interface/configuration.interface.ts) | interface | 项目配置                                                     |
|            [IS3StorageConfiguration](./src/configuration/interface/s3-storage.interface.ts) | interface | S3存储配置                                                   |
|           [IAppConfiguration](./src/configuration/interface/app-configuration.interface.ts) | interface | 应用配置                                                     |
|         [Ii18nConfiguration](./src/configuration/interface/i18n-configuration.interface.ts) | interface | 国际化配置                                                   |
|       [IRedisConfiguration](./src/configuration/interface/redis-configuration.interface.ts) | interface | Redis配置                                                    |
|       [IMySQLConfiguration](./src/configuration/interface/mysql-configuration.interface.ts) | interface | MySQL配置                                                    |
|     [ILoggerConfiguration](./src/configuration/interface/logger-configuration.interface.ts) | interface | 日志配置                                                     |
| [IRabbitmqConfiguration](./src/configuration/interface/rabbitmq-configuration.interface.ts) | interface | Rabbitmq配置                                                 |

### Context

全局上下文模块; 基于[NodeJS Async Local Storage](https://nodejs.org/api/async_context.html)实现的请求上下文模块;

模块目录结构

```bash
📦context
 ┣ 📂decorator
 ┃ ┗ 📜inject-context.decorator.ts
 ┣ 📂service
 ┃ ┗ 📜context.service.ts
 ┣ 📜context.constant.ts
 ┗ 📜context.module.ts
```

#### 模块内容

|                                                                         | 类型      | 说明                                                                                 |
| ----------------------------------------------------------------------: | :-------- | :----------------------------------------------------------------------------------- |
|                     [CLS_REQUEST_ID](./src/context/context.constant.ts) | symbol    | 请求唯一ID写入请求上下文的Key                                                        |
|                    [CLS_INSTANCE_ID](./src/context/context.constant.ts) | symbol    | 当前请求处理进程实例ID写入请求上下文的Key                                            |
|              [ContextService](./src/context/service/context.service.ts) | class     | 请求上下文服务; 提供获取当前请求唯一ID(requestId)和当前实例ID(instanceId)的实现      |
| [@InjectContext()](./src/context/decorator/inject-context.decorator.ts) | decorator | 注入CLS上下文; 用于非HTTP请求处理的流程入口; 诸如: 定时/计划任务, 事件委托, 队列消费 |

### Event

事件驱动, 事件委托模块

模块目录结构

```bash
📦event
 ┣ 📂event
 ┃ ┗ 📜base.event.ts
 ┣ 📂exception
 ┃ ┗ 📜event-deserialization.exception.ts
 ┣ 📂type
 ┃ ┗ 📜event.type.ts
 ┗ 📜event.module.ts
```

#### 模块内容

|                                                                                           | 类型  | 说明                 |
| ----------------------------------------------------------------------------------------: | :---- | :------------------- |
|                                               [EventType](./src/event/type/event.type.ts) | type  | 事件类型             |
|                                              [BaseEvent](./src/event/event/base.event.ts) | class | 事件基类             |
| [EventDeserializationException](./src/event/exception/event-deserialization.exception.ts) | class | 事件信息反序列化异常 |

### Logger

全局日志模块

模块目录结构

```bash
📦logger
 ┣ 📂decorator
 ┃ ┗ 📜inject-logger.decorator.ts
 ┗ 📜logger.module.ts
```

全局日志传输器初始化, 提供以下日志传输器

- 按日切分主文件日志: 默认提供, 输出配置项`LOGGER_LEVEL`指定的级别及以上级别的日志
- 按日切分异常文件日志: 默认提供, 仅输出`ERROR`及以上级别的日志, 用于异常问题排查
- 按日切分JSON格式文件日志: 仅在配置项`LOGGER_JSON`设置为true时提供, 用于ELK等日志收集服务
- 控制台日志: 仅在配置项`LOGGER_CONSOLE`设置为true时提供

上述所有按日切分的文件日志的单日志文件大小阈值和日志滚动保留的文件数量均支持配置

#### 模块内容

|                                                                      | 类型      | 说明     |
| -------------------------------------------------------------------: | :-------- | :------- |
| [@InjectLogger()](./src/logger/decorator/inject-logger.decorator.ts) | decorator | 注入日志 |

### MySQL

基于TypeORM的MySQL数据库动态模块

模块目录结构

```bash
📦mysql
 ┣ 📂decorator
 ┃ ┗ 📜inject-mysql-datasource.decorator.ts
 ┣ 📂interface
 ┃ ┣ 📜datetime-value-transformer-options.ts
 ┃ ┣ 📜mysq-module-options.interface.ts
 ┃ ┗ 📜mysql-datasource-options.interface.ts
 ┣ 📂value-transformer
 ┃ ┣ 📜datetime.value-transformer.ts
 ┃ ┗ 📜json-string.value-transformer.ts
 ┣ 📜mysql.constant.ts
 ┗ 📜mysql.module.ts
```

#### 模块内容

|                                                                                                   | 类型      | 说明                                               |
| ------------------------------------------------------------------------------------------------: | :-------- | :------------------------------------------------- |
|                                       [MYSQL_DATASOURCE_MAP_TOKEN](./src/mysql/mysql.constant.ts) | symbol    | MySQL数据源Map IoC注入Token                        |
|                                   [MYSQL_DATASOURCE_OPTIONS_TOKEN](./src/mysql/mysql.constant.ts) | symbol    | MySQL模块配置选项IoC注入Token                      |
|                             [getMySQLDataSourceToken(name:string)](./src/mysql/mysql.constant.ts) | function  | 获取指定名称MySQL的TypeORM数据源的IoC注入Token     |
|                [IMySQLModuleAsyncOptions](./src/mysql/interface/mysq-module-options.interface.ts) | interface | MySQL 模块动态初始化选项                           |
|            [IMySQLDataSourceOptions](./src/mysql/interface/mysql-datasource-options.interface.ts) | interface | MySQL TypeORM数据源配置选项                        |
|           [DatetimeValueTransformer](./src/mysql/value-transformer/datetime.value-transformer.ts) | class     | datetime类型字段值转换器                           |
|      [JsonStringValueTransformer](./src/mysql/value-transformer/json-string.value-transformer.ts) | class     | json字符串字段值转换器                             |
|   [IDateTimeValueTransformerOptions](./src/mysql/interface/datetime-value-transformer-options.ts) | interface | datetime类型字段转换器转换选项                     |
| [@InjectMySQLDataSource(name:string)](./src/mysql/decorator/inject-mysql-datasource.decorator.ts) | decorator | 用于从IoC容器中获取指定名称的MySQL数据源示例并注入 |

### Redis

Redis动态模块

模块目录结构

```bash
📦redis
 ┣ 📂decorator
 ┃ ┗ 📜inject-redis-client.decorator.ts
 ┣ 📂interface
 ┃ ┣ 📜redis-client-options.interface.ts
 ┃ ┣ 📜redis-event-emit-options.interface.ts
 ┃ ┗ 📜redis-module-options.interface.ts
 ┣ 📂service
 ┃ ┣ 📜redis-event-emitter.service.ts
 ┃ ┗ 📜redis-event-listener.service.ts
 ┣ 📜redis.constant.ts
 ┗ 📜redis.module.ts
```

#### 模块内容

|                                                                                           | 类型      | 说明                                    |
| ----------------------------------------------------------------------------------------: | :-------- | :-------------------------------------- |
|                                  [REDIS_CLIENTS_MAP_TOKEN](./src/redis/redis.constant.ts) | symbol    | Redis连接客户端IoC注入Token             |
|                               [REDIS_CLIENT_OPTIONS_TOKEN](./src/redis/redis.constant.ts) | symbol    | Redis模块异步初始化选项IoC注入Token     |
|                              [REDIS_SUBSCRIBERS_MAP_TOKEN](./src/redis/redis.constant.ts) | symbol    | Redis订阅端IoC注入Token                 |
|                         [getRedisClientToken(name:string)](./src/redis/redis.constant.ts) | function  | 获取指定名称Redis连接客户端IoC注入Token |
|            [IRedisClientOptions](./src/redis/interface/redis-client-options.interface.ts) | interface | Redis客户端/订阅端配置选项              |
|            [RedisEventEmitterService](./src/redis/service/redis-event-emitter.service.ts) | class     | 基于Redis发布订阅实现的事件发布服务     |
|          [RedisEventListenerService](./src/redis/service/redis-event-listener.service.ts) | class     | 基于Redis发布订阅实现的事件订阅监听服务 |
|       [IRedisModuleAsyncOptions](./src/redis/interface/redis-module-options.interface.ts) | interface | Redis模块异步初始化选项                 |
|     [IRedisEventEmitOptions](./src/redis/interface/redis-event-emit-options.interface.ts) | interface | Redis事件发布选项                       |
| [@InjectRedisClient(name:string)](./src/redis/decorator/inject-redis-client.decorator.ts) | decorator | 注入指定名称的Redis连接客户端           |

### Internationalization

全局国际化模块

模块目录结构

```bash
📦internationalization
 ┣ 📂translations
 ┃ ┣ 📂en-US
 ┃ ┃ ┣ 📜entity.json
 ┃ ┃ ┣ 📜exception.json
 ┃ ┃ ┣ 📜property.json
 ┃ ┃ ┗ 📜validation.json
 ┃ ┗ 📂zh-CN
 ┃ ┃ ┣ 📜entity.json
 ┃ ┃ ┣ 📜exception.json
 ┃ ┃ ┣ 📜property.json
 ┃ ┃ ┗ 📜validation.json
 ┗ 📜internationalization.module.ts
```

#### 模块内容

- 国际化语言包
  - zh-CN目录: 简体中文语言包
  - en-US目录: 美式英语语言包

语言包分类

|          文件名 | 文件说明                                                                        |
| --------------: | :------------------------------------------------------------------------------ |
|     entity.json | 实体名称语言包; 定义项目实体名称翻译                                            |
|  exception.json | 异常信息语言包; 定义异常错误信息翻译                                            |
|   property.json | 参数名称语言包; 定义class-validator参数校验失败时返回错误信息中字的字段名称翻译 |
| validation.json | 参数校验规则语言包; 定义class-validator参数校验失败时返回的错误信息翻译         |

- 国际化语言处理器

已配置以下语言处理器

|                   类名 | 说明                                                      |
| ---------------------: | :-------------------------------------------------------- |
|         CookieResolver | 根据请求Cookie中的`language`或`lang`字段确定客户端语言    |
|          QueryResolver | 根据请求Query参数中的`language`或`lang`字段确定客户端语言 |
| AcceptLanguageResolver | 根据请求头中accept-language字段确定客户端语言             |

语言处理器优先级

1. CookieResolver
2. QueryResolver
3. AcceptLanguageResolver

### Rabbitmq

Rabbitmq动态模块

模块目录结构

```bash
📦rabbitmq
 ┣ 📂decorator
 ┃ ┗ 📜inject-rabbitmq-client.decorator.ts
 ┣ 📂exception
 ┃ ┗ 📜message-deserialization.exception.ts
 ┣ 📂interface
 ┃ ┣ 📜rabbitmq-client-options.interface.ts
 ┃ ┗ 📜rabbitmq-module-options.interface.ts
 ┣ 📂message
 ┃ ┗ 📜base.message.ts
 ┣ 📜rabbitmq.constant.ts
 ┗ 📜rabbitmq.module.ts
```

#### 模块内容

|                                                                                                    | 类型      | 说明                                               |
| -------------------------------------------------------------------------------------------------: | :-------- | :------------------------------------------------- |
|                                              [BaseMessage](./src/rabbitmq/message/base.message.ts) | class     | 队列消息基类                                       |
|                                  [RABBITMQ_CLIENTS_MAP_TOKEN](./src/rabbitmq/rabbitmq.constant.ts) | symbol    | Rabbitmq客户端Map IoC注入Token                     |
|                               [RABBITMQ_CLIENT_OPTIONS_TOKEN](./src/rabbitmq/rabbitmq.constant.ts) | symbol    | Rabbitmq模块异步初始化选项IoC注入Token             |
|                         [getRabbitmqClientToken(name:string)](./src/rabbitmq/rabbitmq.constant.ts) | function  | 获取指定名称Rabbitmq队列消息发送客户端IoC注入Token |
|            [IRabbitmqClientOptions](./src/rabbitmq/interface/rabbitmq-client-options.interface.ts) | interface | Rabbitmq客户端配置选项                             |
|       [IRabbitmqModuleAsyncOptions](./src/rabbitmq/interface/rabbitmq-module-options.interface.ts) | interface | Rabbitmq模块异步初始化选项                         |
|   [MessageDeserializationException](./src/rabbitmq/exception/message-deserialization.exception.ts) | class     | 队列消息反序列化异常                               |
| [@InjectRabbitmqClient(name:string)](./src/rabbitmq/decorator/inject-rabbitmq-client.decorator.ts) | decorator | 注入指定名称的Rabbitmq消息发送客户端               |

### S3-Storage

S3对象存储模块

模块目录结构

```bash
📦rabbitmq
 ┣ 📂decorator
 ┃ ┗ 📜inject-rabbitmq-client.decorator.ts
 ┣ 📂exception
 ┃ ┗ 📜message-deserialization.exception.ts
 ┣ 📂interface
 ┃ ┣ 📜rabbitmq-client-options.interface.ts
 ┃ ┗ 📜rabbitmq-module-options.interface.ts
 ┣ 📂message
 ┃ ┗ 📜base.message.ts
 ┣ 📜rabbitmq.constant.ts
 ┗ 📜rabbitmq.module.ts
```

#### 模块内容

|                                                                                                   | 类型      | 说明                                   |
| ------------------------------------------------------------------------------------------------: | :-------- | :------------------------------------- |
|                                             [BaseMessage](./src/rabbitmq/message/base.message.ts) | class     | 队列消息基类                           |
|                                   [S3_CLIENTS_MAP_TOKEN](./src/s3-storage/s3-storage.constant.ts) | symbol    | S3客户端Map IoC注入Token               |
|                                [S3_CLIENT_OPTIONS_TOKEN](./src/s3-storage/s3-storage.constant.ts) | symbol    | S3客户端配置IoC注入Token               |
|                          [getS3ClientToken(name:string)](./src/s3-storage/s3-storage.constant.ts) | function  | 获取指定名称S3存储的客户端IoC注入Token |
|                     [IS3ClientOptions](./src/s3-storage/interface/s3-client-options.interface.ts) | interface | S3客户端选项                           |
|          [@InjectS3Client(name:string)](./src/s3-storage/decorator/inject-s3-client.decorator.ts) | decorator | 注入指定名称的S3客户端                 |
| [IS3StorageModuleAsyncOptions](./src/s3-storage/interface/s3-storage-module-options.interface.ts) | interface | S3存储模块异步初始化选项               |

### Sample

示例模块

MySQL, Context, Internationalization, Rabbitmq, Redis模块实际使用示例

模块目录结构

```bash
📦sample
 ┣ 📂consumer
 ┃ ┗ 📜sample.consumer.ts
 ┣ 📂controller
 ┃ ┗ 📜sample.controller.ts
 ┣ 📂dto
 ┃ ┗ 📜sample.dto.ts
 ┣ 📂entity
 ┃ ┗ 📜sample.default.entity.ts
 ┣ 📂enum
 ┃ ┣ 📜sample-event-pattern.enum.ts
 ┃ ┗ 📜sample-message-pattern.enum.ts
 ┣ 📂event
 ┃ ┗ 📜sample.event.ts
 ┣ 📂event-handler
 ┃ ┗ 📜sample.event-handler.ts
 ┣ 📂message
 ┃ ┗ 📜sample.message.ts
 ┣ 📂pipe
 ┃ ┗ 📜sample-message.pipe.ts
 ┣ 📂scheduler
 ┃ ┗ 📜sample.scheduler.ts
 ┣ 📂service
 ┃ ┗ 📜sample.service.ts
 ┗ 📜sample.module.ts
```
