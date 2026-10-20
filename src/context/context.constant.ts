// #region 通用
/**
 * 本次请求的唯一ID在CLS上下文中存储的Key
 */
export const CLS_REQUEST_ID: unique symbol = Symbol('cls:request-id');

/**
 * 处理本次请求的worker实例ID在CLS上下文中存储的Key
 */
export const CLS_INSTANCE_ID: unique symbol = Symbol('cls:instance-id');

// #endregion

// #region HTTP
/**
 * 本次HTTP请求的Body参数在CLS上下文中存储的Key
 */
export const CLS_HTTP_BODY: unique symbol = Symbol('cls:http:body');

/**
 * 本次HTTP请求的Param参数在CLS上下文中存储的Key
 */
export const CLS_HTTP_PARAM: unique symbol = Symbol('cls:http:param');

/**
 * 本次HTTP请求的Query参数在CLS上下文中存储的Key
 */
export const CLS_HTTP_QUERY: unique symbol = Symbol('cls:http:query');

/**
 * 本次HTTP请求的Header参数在CLS上下文中存储的Key
 */
export const CLS_HTTP_HEADER: unique symbol = Symbol('cls:http:header');

/**
 * 本次HTTP请求的Cookie参数在CLS上下文中存储的Key
 */
export const CLS_HTTP_COOKIE: unique symbol = Symbol('cls:http:cookie');
// #endregion

// #region WebSocket
export const CLS_WS_ID: unique symbol = Symbol('cls:ws:id');
// #endregion
