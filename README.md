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
    - [Internationalization](#internationalization)
      - [模块内容](#模块内容-4)
    - [Logger](#logger)
      - [模块内容](#模块内容-5)
    - [MySQL](#mysql)
      - [模块内容](#模块内容-6)
    - [Rabbitmq](#rabbitmq)
      - [模块内容](#模块内容-7)
    - [Redis](#redis)
      - [模块内容](#模块内容-8)
    - [S3-Storage](#s3-storage)
      - [模块内容](#模块内容-9)
    - [Media](#media)
      - [模块内容](#模块内容-10)
    - [Sample](#sample)

## 项目配置

[全量配置示例&配置项说明](./.env.sample)

## 模块说明

### Common

全局通用模块

模块目录结构

```bash
common
┣ controller
┃ ┣ health-check.controller.test.ts
┃ ┗ health-check.controller.ts
┣ decorator
┃ ┣ cookies.decorator.ts
┃ ┗ json-response.decorator.ts
┣ exception-filter
┃ ┗ global.exception-filter.ts
┣ interceptor
┃ ┣ json-response.interceptor.ts
┃ ┣ performance.interceptor.ts
┃ ┗ request-logger.interceptor.ts
┣ interface
┃ ┣ common-module-options.interface.ts
┃ ┣ data-masking-options.interface.ts
┃ ┣ health-check-result.interface.ts
┃ ┗ json-response.interface.ts
┣ response-transformer
┃ ┣ bigint-support.response-transformer.test.ts
┃ ┗ bigint-support.response-transformer.ts
┣ util
┃ ┣ data-masking.util.test.ts
┃ ┗ data-masking.util.ts
┣ common.module.test.ts
┗ common.module.ts
```

#### 模块内容

|                                                                                                              | 类型      | 说明                                                                       |
| -----------------------------------------------------------------------------------------------------------: | :-------- | :------------------------------------------------------------------------- |
|                                                   [DataMaskingUtil](./src//common/util/data-masking.util.ts) | class     | 数据脱敏工具类; 可用于对字符串类型敏感数据(例如密码)进行数据脱敏           |
|                                           [IJsonResponse](./src/common/interface/json-response.interface.ts) | interface | 统一JSON响应格式                                                           |
|                                        [@Cookies(name?:string)](./src/common/decorator/cookies.decorator.ts) | decorator | 控制器接口函数装饰器, 用于获取请求的Cookie参数                             |
|                                  [HealthCheckController](./src/common/controller/health-check.controller.ts) | class     | 健康检查接口控制器                                                         |
|                                [IHealthCheckResult](./src/common/interface/health-check-result.interface.ts) | interface | 健康检查结果                                                               |
|                                [PerformanceInterceptor](./src/common/interceptor/performance.interceptor.ts) | class     | 性能指标拦截器; 当接口耗时超过指定可配置阈值时, 输出WARN级别日志           |
|                              [IDataMaskingOptions](./src/common/interface/data-masking-options.interface.ts) | interface | 数据脱敏选项                                                               |
|                             [@JsonResp(options?:boolean)](./src/common/decorator/json-response.decorator.ts) | decorator | 控制器接口函数装饰器, 用于标记Controller中的Action函数的响应内容是否为JSON |
|                             [JsonResponseInterceptor](./src/common/interceptor/json-response.interceptor.ts) | class     | JSON响应格式化拦截器, 用于统一所有接口的HTTP响应格式                       |
|                            [GlobalExceptionFilter](./src/common/exception-filter/global.exception-filter.ts) | class     | 全局异常过滤器, 用于全局兜底处理请求内部发生的异常, 并统一响应格式         |
|                           [RequestLoggerInterceptor](./src/common/interceptor/request-logger.interceptor.ts) | class     | 请求参数日志拦截器, 用于在日志中输出每次请求的参数, 建议在开发调试阶段使用 |
|                       [ICommonModuleAsyncOptions](./src/common/interface/common-module-options.interface.ts) | interface | 通用动态模块初始化选项                                                     |
| [BigintSupportResponseTransformer](./src/common/response-transformer/bigint-support.response-transformer.ts) | function  | 支持Bigint的Axios响应转换器;                                               |

### Configuration

全局配置模块

模块目录结构

```bash
configuration
┣ exception
┃ ┣ invalid-env.exception.ts
┃ ┗ missing-required-env.exception.ts
┣ interface
┃ ┣ app-configuration.interface.ts
┃ ┣ configuration.interface.ts
┃ ┣ i18n-configuration.interface.ts
┃ ┣ logger-configuration.interface.ts
┃ ┣ mysql-configuration.interface.ts
┃ ┣ rabbitmq-configuration.interface.ts
┃ ┣ redis-configuration.interface.ts
┃ ┗ s3-storage.interface.ts
┣ util
┃ ┣ env-value-load.util.test.ts
┃ ┗ env-value-load.util.ts
┣ configuration-loader.ts
┣ configuration.module.test.ts
┗ configuration.module.ts
```

#### 模块内容

|                                                                                                | 类型      | 说明                                                         |
| ---------------------------------------------------------------------------------------------: | :-------- | :----------------------------------------------------------- |
|                            [EnvValueLoadUtil](./src/configuration/util/env-value-load.util.ts) | class     | 环境变量配置加载工具类, 提供以下静态函数用于加载环境变量配置 |
|                         [configuration-loader.ts](./src/configuration/configuration-loader.ts) | function  | 项目配置加载函数                                             |
|                     [IConfiguration](./src/configuration/interface/configuration.interface.ts) | interface | 项目配置                                                     |
|               [IS3StorageConfiguration](./src/configuration/interface/s3-storage.interface.ts) | interface | S3存储配置                                                   |
|              [IAppConfiguration](./src/configuration/interface/app-configuration.interface.ts) | interface | 应用配置                                                     |
|            [Ii18nConfiguration](./src/configuration/interface/i18n-configuration.interface.ts) | interface | 国际化配置                                                   |
|          [IRedisConfiguration](./src/configuration/interface/redis-configuration.interface.ts) | interface | Redis配置                                                    |
|          [IMySQLConfiguration](./src/configuration/interface/mysql-configuration.interface.ts) | interface | MySQL配置                                                    |
|        [ILoggerConfiguration](./src/configuration/interface/logger-configuration.interface.ts) | interface | 日志配置                                                     |
|    [IRabbitmqConfiguration](./src/configuration/interface/rabbitmq-configuration.interface.ts) | interface | Rabbitmq配置                                                 |
|                  [InvalidEnvException](./src/configuration/exception/invalid-env.exception.ts) | class     | 环境变量配置值无效异常                                       |
| [MissingRequiredEnvException](./src/configuration/exception/missing-required-env.exception.ts) | class     | 缺少必须环境变量异常                                         |

### Context

全局上下文模块; 基于[NodeJS Async Local Storage](https://nodejs.org/api/async_context.html)实现的请求上下文模块;

模块目录结构

```bash
context
┣ decorator
┃ ┣ inject-context.decorator.test.ts
┃ ┗ inject-context.decorator.ts
┣ interface
┃ ┣ context-request.interface.ts
┃ ┗ context-store.interface.ts
┣ service
┃ ┣ context.service.test.ts
┃ ┗ context.service.ts
┣ context.constant.ts
┣ context.module.test.ts
┗ context.module.ts
```

#### 模块内容

|                                                                         | 类型      | 说明                                                                                 |
| ----------------------------------------------------------------------: | :-------- | :----------------------------------------------------------------------------------- |
|                     [CLS_REQUEST_ID](./src/context/context.constant.ts) | symbol    | 请求唯一ID写入请求上下文的Key                                                        |
|                    [CLS_INSTANCE_ID](./src/context/context.constant.ts) | symbol    | 当前请求处理进程实例ID写入请求上下文的Key                                            |
|              [ContextService](./src/context/service/context.service.ts) | class     | 请求上下文服务; 提供获取当前请求唯一ID(requestId)和当前实例ID(instanceId)的实现      |
| [@InjectContext()](./src/context/decorator/inject-context.decorator.ts) | decorator | 注入CLS上下文; 用于非HTTP请求处理的流程入口; 诸如: 定时/计划任务, 事件委托, 队列消费 |
|     [IContextStore](./src/context/interface/context-store.interface.ts) | interface | 请求上下文存储结构                                                                   |
| [IContextRequest](./src/context/interface/context-request.interface.ts) | interface | 请求上下文中的请求参数结构                                                           |

### Event

事件驱动, 事件委托模块

模块目录结构

```bash
event
┣ event
┃ ┣ base.event.test.ts
┃ ┗ base.event.ts
┣ exception
┃ ┗ event-deserialization.exception.ts
┣ type
┃ ┗ event.type.ts
┣ event.module.test.ts
┗ event.module.ts
```

#### 模块内容

|                                                                                           | 类型  | 说明                 |
| ----------------------------------------------------------------------------------------: | :---- | :------------------- |
|                                               [EventType](./src/event/type/event.type.ts) | type  | 事件类型             |
|                                              [BaseEvent](./src/event/event/base.event.ts) | class | 事件基类             |
| [EventDeserializationException](./src/event/exception/event-deserialization.exception.ts) | class | 事件信息反序列化异常 |

### Internationalization

全局国际化模块

模块目录结构

```bash
internationalization
 ┣ translations
 ┃ ┣ en-US
 ┃ ┃ ┣ entity.json
 ┃ ┃ ┣ exception.json
 ┃ ┃ ┣ property.json
 ┃ ┃ ┗ validation.json
 ┃ ┗ zh-CN
 ┃ ┃ ┣ entity.json
 ┃ ┃ ┣ exception.json
 ┃ ┃ ┣ property.json
 ┃ ┃ ┗ validation.json
 ┗ internationalization.module.ts
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

### Logger

全局日志模块

模块目录结构

```bash
logger
┣ decorator
┃ ┣ inject-logger.decorator.test.ts
┃ ┣ inject-logger.decorator.ts
┃ ┣ logging-performance.decorator.test.ts
┃ ┗ logging-performance.decorator.ts
┣ interface
┃ ┗ logging-performance-options.interface.ts
┣ logger.constant.ts
┣ logger.module.test.ts
┗ logger.module.ts
```

全局日志传输器初始化, 提供以下日志传输器

- 按日切分主文件日志: 默认提供, 输出配置项`LOGGER_LEVEL`指定的级别及以上级别的日志
- 按日切分异常文件日志: 默认提供, 仅输出`ERROR`及以上级别的日志, 用于异常问题排查
- 按日切分JSON格式文件日志: 仅在配置项`LOGGER_JSON`设置为true时提供, 用于ELK等日志收集服务
- 控制台日志: 仅在配置项`LOGGER_CONSOLE`设置为true时提供

上述所有按日切分的文件日志的单日志文件大小阈值和日志滚动保留的文件数量均支持配置

#### 模块内容

|                                                                                                                    | 类型      | 说明                                                                                                         |
| -----------------------------------------------------------------------------------------------------------------: | :-------- | :----------------------------------------------------------------------------------------------------------- |
|                                               [@InjectLogger()](./src/logger/decorator/inject-logger.decorator.ts) | decorator | 注入Winston日志Logger                                                                                        |
|                       [LoggingPerformanceOptions](./src/logger/interface/logging-performance-options.interface.ts) | interface | [@LoggingPerformance()](./src/logger/decorator/logging-performance.decorator.ts)函数装饰器可选选项           |
| [@LoggingPerformance(options?:LoggingPerformanceOptions)](./src/logger/decorator/logging-performance.decorator.ts) | decorator | 函数装饰器, 用于函数执行耗时的性能检测                                                                       |
|                                                                     [WRAPPED_TAG](./src/logger/logger.constant.ts) | symbol    | [@LoggingPerformance()](./src/logger/decorator/logging-performance.decorator.ts)已包装标记, 用于防止重复包装 |

### MySQL

基于TypeORM的MySQL数据库动态模块

模块目录结构

```bash
mysql
┣ decorator
┃ ┣ inject-mysql-datasource.decorator.test.ts
┃ ┣ inject-mysql-datasource.decorator.ts
┃ ┣ inject-repo.decorator.test.ts
┃ ┗ inject-repo.decorator.ts
┣ exception
┃ ┣ json-value-transfor.exception.ts
┃ ┗ mysql-datasource-not-found.exception.ts
┣ interface
┃ ┣ datetime-value-transformer-options.interface.ts
┃ ┣ json-value-transformer-options.interface.ts
┃ ┣ mysq-module-options.interface.ts
┃ ┣ mysql-datasource-options.interface.ts
┃ ┗ string-encrypt-value-transformer-options.interface.ts
┣ value-transformer
┃ ┣ datetime.value-transformer.test.ts
┃ ┣ datetime.value-transformer.ts
┃ ┣ json-string.value-transformer.test.ts
┃ ┣ json-string.value-transformer.ts
┃ ┣ string-encrypt.value-transformer.test.ts
┃ ┗ string-encrypt.value-transformer.ts
┣ mysql.constant.ts
┣ mysql.module.test.ts
┗ mysql.module.ts
```

#### 模块内容

|                                                                                                                         | 类型      | 说明                                                                 |
| ----------------------------------------------------------------------------------------------------------------------: | :-------- | :------------------------------------------------------------------- |
|                                                             [MYSQL_DATASOURCE_MAP_TOKEN](./src/mysql/mysql.constant.ts) | symbol    | MySQL数据源Map IoC注入Token                                          |
|                                                         [MYSQL_DATASOURCE_OPTIONS_TOKEN](./src/mysql/mysql.constant.ts) | symbol    | MySQL模块配置选项IoC注入Token                                        |
|                                                         [@InjectRepo()](./src/mysql/decorator/inject-repo.decorator.ts) | decorator | 用于从IoC容器种获取指定MySQL数据源中指定实体类的Repository示例并注入 |
|                                                   [getMySQLDataSourceToken(name:string)](./src/mysql/mysql.constant.ts) | function  | 获取指定名称MySQL的TypeORM数据源的IoC注入Token                       |
|                                      [IMySQLModuleAsyncOptions](./src/mysql/interface/mysq-module-options.interface.ts) | interface | MySQL 模块动态初始化选项                                             |
|                                   [JsonValueTransformException](./src/mysql/exception/json-value-transfor.exception.ts) | class     | JSON数值转换异常                                                     |
|                                  [IMySQLDataSourceOptions](./src/mysql/interface/mysql-datasource-options.interface.ts) | interface | MySQL TypeORM数据源配置选项                                          |
|                                 [DatetimeValueTransformer](./src/mysql/value-transformer/datetime.value-transformer.ts) | class     | datetime类型字段值转换器                                             |
|                            [JsonStringValueTransformer](./src/mysql/value-transformer/json-string.value-transformer.ts) | class     | json字符串字段值转换器                                               |
|                         [IDateTimeValueTransformerOptions](./src/mysql/interface/datetime-value-transformer-options.ts) | interface | datetime类型字段转换器转换选项                                       |
|                       [@InjectMySQLDataSource(name:string)](./src/mysql/decorator/inject-mysql-datasource.decorator.ts) | decorator | 用于从IoC容器中获取指定名称的MySQL数据源示例并注入                   |
|                       [MySQLDataSourceNotFoundException](./src/mysql/exception/mysql-datasource-not-found.exception.ts) | class     | 指定名称MySQL数据源未找到异常                                        |
|                                        [getMySQLRepoToken(name:string, entity:Function)](./src/mysql/mysql.constant.ts) | function  | 获取指定数据源下指定实体的Repository IoC注入Token                    |
|                   [StringAesEncryptValueTransformer](./src/mysql/value-transformer/string-encrypt.value-transformer.ts) | class     | 字符串AES加密转换器                                                  |
| [IStringAesEncryptValueTransformerOptions](./src/mysql/interface/string-encrypt-value-transformer-options.interface.ts) | interface | 字符串AES加密转换器配置选项                                          |

### Rabbitmq

Rabbitmq动态模块

模块目录结构

```bash
rabbitmq
┣ decorator
┃ ┣ inject-rabbitmq-client.decorator.test.ts
┃ ┗ inject-rabbitmq-client.decorator.ts
┣ exception
┃ ┣ message-deserialization.exception.ts
┃ ┗ rabbitmq-client-not-found.exception.ts
┣ interface
┃ ┣ rabbitmq-client-options.interface.ts
┃ ┗ rabbitmq-module-options.interface.ts
┣ message
┃ ┣ base.message.test.ts
┃ ┗ base.message.ts
┣ pipe
┃ ┣ rabbitmq-message.pipe.test.ts
┃ ┗ rabbitmq-message.pipe.ts
┣ rabbitmq.constant.ts
┣ rabbitmq.module.test.ts
┗ rabbitmq.module.ts
```

#### 模块内容

|                                                                                                  | 类型      | 说明                                               |
| -----------------------------------------------------------------------------------------------: | :-------- | :------------------------------------------------- |
|                                            [BaseMessage](./src/rabbitmq/message/base.message.ts) | class     | 队列消息基类                                       |
|                                [RABBITMQ_CLIENTS_MAP_TOKEN](./src/rabbitmq/rabbitmq.constant.ts) | symbol    | Rabbitmq客户端Map IoC注入Token                     |
|                              [RabbitmqMessagePipe](./src/rabbitmq/pipe/rabbitmq-message.pipe.ts) | class     | 队列消息转换管道                                   |
|                             [RABBITMQ_CLIENT_OPTIONS_TOKEN](./src/rabbitmq/rabbitmq.constant.ts) | symbol    | Rabbitmq模块异步初始化选项IoC注入Token             |
|                       [getRabbitmqClientToken(name:string)](./src/rabbitmq/rabbitmq.constant.ts) | function  | 获取指定名称Rabbitmq队列消息发送客户端IoC注入Token |
|          [IRabbitmqClientOptions](./src/rabbitmq/interface/rabbitmq-client-options.interface.ts) | interface | Rabbitmq客户端配置选项                             |
|     [IRabbitmqModuleAsyncOptions](./src/rabbitmq/interface/rabbitmq-module-options.interface.ts) | interface | Rabbitmq模块异步初始化选项                         |
| [MessageDeserializationException](./src/rabbitmq/exception/message-deserialization.exception.ts) | class     | 队列消息反序列化异常                               |

| [@InjectRabbitmqClient(name:string)](./src/rabbitmq/decorator/inject-rabbitmq-client.decorator.ts) | decorator | 注入指定名称的Rabbitmq消息发送客户端 |
| [RabbitmqClientNotFoundException](./src/rabbitmq/exception/rabbitmq-client-not-found.exception.ts) | class | 指定名称Rabbitmq消息发送端未找到异常 |

### Redis

Redis动态模块

模块目录结构

```bash
redis
┣ decorator
┃ ┣ inject-redis-client.decorator.test.ts
┃ ┗ inject-redis-client.decorator.ts
┣ exception
┃ ┗ redis-client-not-found.exception.ts
┣ interface
┃ ┣ redis-client-options.interface.ts
┃ ┣ redis-event-emit-options.interface.ts
┃ ┗ redis-module-options.interface.ts
┣ service
┃ ┣ redis-event-emitter.service.test.ts
┃ ┣ redis-event-emitter.service.ts
┃ ┣ redis-event-listener.service.test.ts
┃ ┗ redis-event-listener.service.ts
┣ redis.constant.ts
┣ redis.module.test.ts
┗ redis.module.ts
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
| [RedisClientNotFoundException](./src/redis/exception/redis-client-not-found.exception.ts) | class     | 指定名称redis客户端未找到异常           |

### S3-Storage

S3对象存储模块

模块目录结构

```bash
s3-storage
┣ decorator
┃ ┣ inject-s3-client.decorator.test.ts
┃ ┗ inject-s3-client.decorator.ts
┣ exception
┃ ┗ s3-client-not-found.exception.ts
┣ interface
┃ ┣ s3-client-options.interface.ts
┃ ┗ s3-storage-module-options.interface.ts
┣ s3-storage.constant.ts
┣ s3-storage.module.test.ts
┗ s3-storage.module.ts
```

#### 模块内容

|                                                                                                   | 类型      | 说明                                   |
| ------------------------------------------------------------------------------------------------: | :-------- | :------------------------------------- |
|                                   [S3_CLIENTS_MAP_TOKEN](./src/s3-storage/s3-storage.constant.ts) | symbol    | S3客户端Map IoC注入Token               |
|                                [S3_CLIENT_OPTIONS_TOKEN](./src/s3-storage/s3-storage.constant.ts) | symbol    | S3客户端配置IoC注入Token               |
|                          [getS3ClientToken(name:string)](./src/s3-storage/s3-storage.constant.ts) | function  | 获取指定名称S3存储的客户端IoC注入Token |
|                     [IS3ClientOptions](./src/s3-storage/interface/s3-client-options.interface.ts) | interface | S3客户端选项                           |
|          [@InjectS3Client(name:string)](./src/s3-storage/decorator/inject-s3-client.decorator.ts) | decorator | 注入指定名称的S3客户端                 |
|          [S3ClientNotFoundException](./src/s3-storage/exception/s3-client-not-found.exception.ts) | class     | 指定名称S3客户端对象未找到异常         |
| [IS3StorageModuleAsyncOptions](./src/s3-storage/interface/s3-storage-module-options.interface.ts) | interface | S3存储模块异步初始化选项               |

### Media

媒体模块

模块目录结构

```bash
media
┣ decorator
┃ ┣ aspect-ratio.decorator.test.ts
┃ ┣ aspect-ratio.decorator.ts
┃ ┣ audio-duration.decorator.test.ts
┃ ┣ audio-duration.decorator.ts
┃ ┣ duration.decorator.test.ts
┃ ┣ duration.decorator.ts
┃ ┣ fps.decorator.test.ts
┃ ┣ fps.decorator.ts
┃ ┣ height.decorator.test.ts
┃ ┣ height.decorator.ts
┃ ┣ is-audio.decorator.test.ts
┃ ┣ is-audio.decorator.ts
┃ ┣ is-codec.decorator.test.ts
┃ ┣ is-codec.decorator.ts
┃ ┣ is-image.decorator.test.ts
┃ ┣ is-image.decorator.ts
┃ ┣ is-subtitle.decorator.test.ts
┃ ┣ is-subtitle.decorator.ts
┃ ┣ is-video.decorator.test.ts
┃ ┣ is-video.decorator.ts
┃ ┣ max-aspect-ratio.decorator.test.ts
┃ ┣ max-aspect-ratio.decorator.ts
┃ ┣ max-audio-duration.decorator.test.ts
┃ ┣ max-audio-duration.decorator.ts
┃ ┣ max-duration.decorator.test.ts
┃ ┣ max-duration.decorator.ts
┃ ┣ max-fps.decorator.test.ts
┃ ┣ max-fps.decorator.ts
┃ ┣ max-height.decorator.test.ts
┃ ┣ max-height.decorator.ts
┃ ┣ max-media-size.decorator.test.ts
┃ ┣ max-media-size.decorator.ts
┃ ┣ max-pixels.decorator.test.ts
┃ ┣ max-pixels.decorator.ts
┃ ┣ max-video-duration.decorator.test.ts
┃ ┣ max-video-duration.decorator.ts
┃ ┣ max-width.decorator.test.ts
┃ ┣ max-width.decorator.ts
┃ ┣ media-size.decorator.test.ts
┃ ┣ media-size.decorator.ts
┃ ┣ min-aspect-ratio.decorator.test.ts
┃ ┣ min-aspect-ratio.decorator.ts
┃ ┣ min-audio-duration.decorator.test.ts
┃ ┣ min-audio-duration.decorator.ts
┃ ┣ min-duration.decorator.test.ts
┃ ┣ min-duration.decorator.ts
┃ ┣ min-fps.decorator.test.ts
┃ ┣ min-fps.decorator.ts
┃ ┣ min-height.decorator.test.ts
┃ ┣ min-height.decorator.ts
┃ ┣ min-media-size.decorator.test.ts
┃ ┣ min-media-size.decorator.ts
┃ ┣ min-pixels.decorator.test.ts
┃ ┣ min-pixels.decorator.ts
┃ ┣ min-video-duration.decorator.test.ts
┃ ┣ min-video-duration.decorator.ts
┃ ┣ min-width.decorator.test.ts
┃ ┣ min-width.decorator.ts
┃ ┣ pixels.decorator.test.ts
┃ ┣ pixels.decorator.ts
┃ ┣ video-duration.decorator.test.ts
┃ ┣ video-duration.decorator.ts
┃ ┣ width.decorator.test.ts
┃ ┗ width.decorator.ts
┣ exception
┃ ┗ media.exception.ts
┣ implement
┃ ┣ media-audio-stream.impl.ts
┃ ┣ media-format.impl.ts
┃ ┣ media-stream.impl.ts
┃ ┣ media-subtitle-stream.impl.ts
┃ ┣ media-video-stream.impl.ts
┃ ┣ media.impl.test.ts
┃ ┗ media.impl.ts
┣ interface
┃ ┣ media-audio-stream.interface.ts
┃ ┣ media-format.interface.ts
┃ ┣ media-subtitle-stream.interface.ts
┃ ┣ media-video-stream.interface.ts
┃ ┗ media.interface.ts
┣ service
┃ ┣ media.service.test.ts
┃ ┗ media.service.ts
┣ validator
┃ ┣ util
┃ ┃ ┣ validate-aspect-ratio.util.ts
┃ ┃ ┣ validate-dimension.util.ts
┃ ┃ ┣ validate-duration.util.ts
┃ ┃ ┣ validate-fps.util.ts
┃ ┃ ┣ validate-media-size.util.ts
┃ ┃ ┗ validate-pixels.util.ts
┃ ┣ aspect-ratio.validator.ts
┃ ┣ duration.validator.ts
┃ ┣ fps.validator.ts
┃ ┣ height.validator.ts
┃ ┣ is-audio.validator.ts
┃ ┣ is-codec.validator.ts
┃ ┣ is-image.validator.ts
┃ ┣ is-subtitle.validator.ts
┃ ┣ is-video.validator.ts
┃ ┣ max-aspect-ratio.validator.ts
┃ ┣ max-duration.validator.ts
┃ ┣ max-fps.validator.ts
┃ ┣ max-height.validator.ts
┃ ┣ max-media-size.validator.ts
┃ ┣ max-pixels.validator.ts
┃ ┣ max-width.validator.ts
┃ ┣ media-size.validator.ts
┃ ┣ min-aspect-ratio.validator.ts
┃ ┣ min-duration.validator.ts
┃ ┣ min-fps.validator.ts
┃ ┣ min-height.validator.ts
┃ ┣ min-media-size.validator.ts
┃ ┣ min-pixels.validator.ts
┃ ┣ min-width.validator.ts
┃ ┣ pixels.validator.ts
┃ ┗ width.validator.ts
┣ media.constant.ts
┣ media.module.test.ts
┗ media.module.ts
```

#### 模块内容

|                                                                                  | 类型          | 说明                                                                                   |
| -------------------------------------------------------------------------------: | :------------ | :------------------------------------------------------------------------------------- |
|                        [@IsCodec()](./src/media/decorator/is-codec.decorator.ts) | decorator     | 媒体编码器校验装饰器                                                                   |
|                        [@IsImage()](./src/media/decorator/is-image.decorator.ts) | decorator     | 媒体类型是否为`图片`媒体校验装饰器                                                     |
|                        [@IsAudio()](./src/media/decorator/is-audio.decorator.ts) | decorator     | 媒体类型是否为`音频`媒体校验装饰器                                                     |
|                        [@IsVideo()](./src/media/decorator/is-video.decorator.ts) | decorator     | 媒体类型是否为`视频`媒体校验装饰器                                                     |
|                  [@IsSubtitle()](./src/media/decorator/is-subtitle.decorator.ts) | decorator     | 媒体类型是否为`字幕`媒体校验装饰器                                                     |
|            [@AudioDuration()](./src/media/decorator/audio-duration.decorator.ts) | decorator     | `音频流`时长范围校验装饰器; Duration固定流类型的便捷形式                               |
|     [@MaxAudioDuration()](./src/media/decorator/max-audio-duration.decorator.ts) | decorator     | `音频流`时长上限校验装饰器; MaxDuration固定流类型的便捷形式                            |
|     [@MinAudioDuration()](./src/media/decorator/min-audio-duration.decorator.ts) | decorator     | `音频流`时长下限校验装饰器; MinDuration固定流类型的便捷形式                            |
|            [@VideoDuration()](./src/media/decorator/video-duration.decorator.ts) | decorator     | `视频流`时长范围校验装饰器; Duration固定流类型的便捷形式                               |
|     [@MaxVideoDuration()](./src/media/decorator/max-video-duration.decorator.ts) | decorator     | `视频流`时长上限校验装饰器; MaxDuration固定流类型的便捷形式                            |
|     [@MinVideoDuration()](./src/media/decorator/min-video-duration.decorator.ts) | decorator     | `视频流`时长下限校验装饰器; MinDuration固定流类型的便捷形式                            |
|                [@AspectRatio()](./src/media/decorator/aspect-ratio.decorator.ts) | decorator     | 视频或图片媒体`宽高比范围`校验装饰器                                                   |
|         [@MaxAspectRatio()](./src/media/decorator/max-aspect-ratio.decorator.ts) | decorator     | 视频或图片媒体`宽高比上限`校验装饰器                                                   |
|         [@MinAspectRatio()](./src/media/decorator/min-aspect-ratio.decorator.ts) | decorator     | 视频或图片媒体`宽高比下限`校验装饰器                                                   |
|                       [@Duration()](./src/media/decorator/duration.decorator.ts) | decorator     | 视频或音频媒体`时长范围`校验装饰器                                                     |
|                [@MaxDuration()](./src/media/decorator/max-duration.decorator.ts) | decorator     | 视频或音频媒体`时长上限`校验装饰器                                                     |
|                [@MinDuration()](./src/media/decorator/min-duration.decorator.ts) | decorator     | 视频或音频媒体`时长下限`校验装饰器                                                     |
|                                 [@Fps()](./src/media/decorator/fps.decorator.ts) | decorator     | 视频媒体`帧率范围`校验装饰器                                                           |
|                          [@MaxFps()](./src/media/decorator/max-fps.decorator.ts) | decorator     | 视频媒体`帧率上限`校验装饰器                                                           |
|                          [@MinFps()](./src/media/decorator/min-fps.decorator.ts) | decorator     | 视频媒体`帧率下限`校验装饰器                                                           |
|                             [@Width()](./src/media/decorator/width.decorator.ts) | decorator     | 视频或图片媒体`画面宽度范围`校验装饰器                                                 |
|                      [@MaxWidth()](./src/media/decorator/max-width.decorator.ts) | decorator     | 视频或图片媒体`画面宽度上限`校验装饰器                                                 |
|                      [@MinWidth()](./src/media/decorator/min-width.decorator.ts) | decorator     | 视频或图片媒体`画面宽度下限`校验装饰器                                                 |
|                           [@Height()](./src/media/decorator/height.decorator.ts) | decorator     | 视频或图片媒体`画面高度范围`校验装饰器                                                 |
|                    [@MaxHeight()](./src/media/decorator/max-height.decorator.ts) | decorator     | 视频或图片媒体`画面高度上限`校验装饰器                                                 |
|                    [@MinHeight()](./src/media/decorator/min-height.decorator.ts) | decorator     | 视频或图片媒体`画面高度下限`校验装饰器                                                 |
|                           [@Pixels()](./src/media/decorator/pixels.decorator.ts) | decorator     | 视频或图片媒体`画面像素数范围`校验装饰器                                               |
|                    [@MaxPixels()](./src/media/decorator/max-pixels.decorator.ts) | decorator     | 视频或图片媒体`画面像素数上限`校验装饰器                                               |
|                    [@MinPixels()](./src/media/decorator/min-pixels.decorator.ts) | decorator     | 视频或图片媒体`画面像素数下限`校验装饰器                                               |
|                    [@MediaSize()](./src/media/decorator/media-size.decorator.ts) | decorator     | 媒体`文件大小范围`校验装饰器                                                           |
|             [@MaxMediaSize()](./src/media/decorator/max-media-size.decorator.ts) | decorator     | 媒体`文件大小上限`校验装饰器                                                           |
|             [@MinMediaSize()](./src/media/decorator/min-media-size.decorator.ts) | decorator     | 媒体`文件大小下限`校验装饰器                                                           |
|                       [MediaException](./src/media/exception/media.exception.ts) | class         | 媒体异常类, 用于媒体信息读取过程中发生的异常                                           |
|                               [IMedia](./src/media/interface/media.interface.ts) | interface     | 媒体信息接口                                                                           |
|                  [IMediaFormat](./src/media/interface/media-format.interface.ts) | interface     | 媒体格式信息接口                                                                       |
|       [IMediaAudioStream](./src/media/interface/media-audio-stream.interface.ts) | interface     | 媒体音频流信息接口                                                                     |
|       [IMediaVideoStream](./src/media/interface/media-video-stream.interface.ts) | interface     | 媒体视频流信息接口                                                                     |
|                                     [Media](./src/media/implement/media.impl.ts) | class         | [IMedia](./src/media/interface/media.interface.ts)实现类                               |
|                        [MediaFormat](./src/media/implement/media-format.impl.ts) | class         | [IMediaFormat](./src/media/interface/media-format.interface.ts)实现类                  |
|                        [MediaStream](./src/media/implement/media-stream.impl.ts) | class         | 媒体流信息基类                                                                         |
|             [MediaAudioStream](./src/media/implement/media-audio-stream.impl.ts) | class         | [IMediaAudioStream](./src/media/interface/media-audio-stream.interface.ts)实现类       |
| [IMediaSubtitleStream](./src/media/interface/media-subtitle-stream.interface.ts) | interface     | 媒体字幕流信息接口                                                                     |
|       [MediaSubtitleStream](./src/media/implement/media-subtitle-stream.impl.ts) | class         | [IMediaSubtitleStream](./src/media/interface/media-subtitle-stream.interface.ts)实现类 |
|             [MediaVideoStream](./src/media/implement/media-video-stream.impl.ts) | class         | [IMediaVideoStream](./src/media/interface/media-video-stream.interface.ts)实现类       |
|                             [MediaService](./src/media/service/media.service.ts) | class         | 媒体信息服务类                                                                         |
|                  [IsCodecValidator](./src/media/validator/is-codec.validator.ts) | class         | 媒体编码器校验器                                                                       |
|                  [IsImageValidator](./src/media/validator/is-image.validator.ts) | class         | 媒体类型是否为`图片`媒体校验器                                                         |
|                  [IsAudioValidator](./src/media/validator/is-audio.validator.ts) | class         | 媒体类型是否为`音频`媒体校验器                                                         |
|                  [IsVideoValidator](./src/media/validator/is-video.validator.ts) | class         | 媒体类型是否为`视频`媒体校验器                                                         |
|            [IsSubtitleValidator](./src/media/validator/is-subtitle.validator.ts) | class         | 媒体类型是否为`字幕`媒体校验器                                                         |
|          [AspectRatioValidator](./src/media/validator/aspect-ratio.validator.ts) | class         | 视频或图片媒体`宽高比范围`校验器                                                       |
|   [MaxAspectRatioValidator](./src/media/validator/max-aspect-ratio.validator.ts) | class         | 视频或图片媒体`宽高比上限`校验器                                                       |
|   [MinAspectRatioValidator](./src/media/validator/min-aspect-ratio.validator.ts) | class         | 视频或图片媒体`宽高比下限`校验器                                                       |
|                 [DurationValidator](./src/media/validator/duration.validator.ts) | class         | 视频或音频媒体`时长范围`校验器                                                         |
|          [MaxDurationValidator](./src/media/validator/max-duration.validator.ts) | class         | 视频或音频媒体`时长上限`校验器                                                         |
|          [MinDurationValidator](./src/media/validator/min-duration.validator.ts) | class         | 视频或音频媒体`时长下限`校验器                                                         |
|                           [FpsValidator](./src/media/validator/fps.validator.ts) | class         | 视频媒体`帧率范围`校验器                                                               |
|                    [MaxFpsValidator](./src/media/validator/max-fps.validator.ts) | class         | 视频媒体`帧率上限`校验器                                                               |
|                    [MinFpsValidator](./src/media/validator/min-fps.validator.ts) | class         | 视频媒体`帧率下限`校验器                                                               |
|                       [WidthValidator](./src/media/validator/width.validator.ts) | class         | 视频或图片媒体`画面宽度范围`校验器                                                     |
|                [MaxWidthValidator](./src/media/validator/max-width.validator.ts) | class         | 视频或图片媒体`画面宽度上限`校验器                                                     |
|                [MinWidthValidator](./src/media/validator/min-width.validator.ts) | class         | 视频或图片媒体`画面宽度下限`校验器                                                     |
|                     [HeightValidator](./src/media/validator/height.validator.ts) | class         | 视频或图片媒体`画面高度范围`校验器                                                     |
|              [MaxHeightValidator](./src/media/validator/max-height.validator.ts) | class         | 视频或图片媒体`画面高度上限`校验器                                                     |
|              [MinHeightValidator](./src/media/validator/min-height.validator.ts) | class         | 视频或图片媒体`画面高度下限`校验器                                                     |
|                     [PixelsValidator](./src/media/validator/pixels.validator.ts) | class         | 视频或图片媒体`画面像素数范围`校验器                                                   |
|              [MaxPixelsValidator](./src/media/validator/max-pixels.validator.ts) | class         | 视频或图片媒体`画面像素数上限`校验器                                                   |
|              [MinPixelsValidator](./src/media/validator/min-pixels.validator.ts) | class         | 视频或图片媒体`画面像素数下限`校验器                                                   |
|              [MediaSizeValidator](./src/media/validator/media-size.validator.ts) | class         | 媒体`文件大小范围`校验器                                                               |
|       [MaxMediaSizeValidator](./src/media/validator/max-media-size.validator.ts) | class         | 媒体`文件大小上限`校验器                                                               |
|       [MinMediaSizeValidator](./src/media/validator/min-media-size.validator.ts) | class         | 媒体`文件大小下限`校验器                                                               |
|                                   [IMAGE_DEMUXER](./src/media/media.constant.ts) | Array<string> | 图片媒体封装格式分流器列表常量                                                         |
|                                      [ECodecType](./src/media/media.constant.ts) | enum          | 媒体编码类型枚举                                                                       |
|   [ValidateDimensionUtil](./src/media/validator/util/validate-dimension.util.ts) | class         | 画面尺寸校验流选取工具类                                                               |
|                                [MediaTestUtil](./src/media/media.module.test.ts) | class         | 测试辅助工具类; 提供测试资产下载与清理                                                 |

### Sample

示例业务模块

上述模块实际使用示例

模块目录结构

```bash
sample
 ┣ consumer
 ┃ ┗ sample.consumer.ts
 ┣ controller
 ┃ ┗ sample.controller.ts
 ┣ dto
 ┃ ┗ sample.dto.ts
 ┣ entity
 ┃ ┗ sample.default.entity.ts
 ┣ enum
 ┃ ┣ sample-event-pattern.enum.ts
 ┃ ┗ sample-message-pattern.enum.ts
 ┣ event
 ┃ ┗ sample.event.ts
 ┣ event-handler
 ┃ ┗ sample.event-handler.ts
 ┣ message
 ┃ ┗ sample.message.ts
 ┣ pipe
 ┃ ┗ sample-message.pipe.ts
 ┣ scheduler
 ┃ ┗ sample.scheduler.ts
 ┣ service
 ┃ ┗ sample.service.ts
 ┗ sample.module.ts
```
