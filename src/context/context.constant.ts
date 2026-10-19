/**
 * 本次请求的唯一ID在CLS上下文中存储的Key
 */
export const CLS_REQUEST_ID = Symbol('cls:request-id');

/**
 * 当前实例编号上下文中存储的Key
 */
export const CLS_INSTANCE_ID = Symbol('cls:instance-id');

/**
 * 本次请求的Body参数在CLS上下文中存储的Key
 */
export const CLS_REQUEST_BODY = Symbol('cls:request:body');

/**
 * 本次请求的Param参数在CLS上下文中存储的Key
 */
export const CLS_REQUEST_PARAM = Symbol('cls:request:param');

/**
 * 本次请求的Query参数在CLS上下文中存储的Key
 */
export const CLS_REQUEST_QUERY = Symbol('cls:request:query');

/**
 * 本次请求的Header参数在CLS上下文中存储的Key
 */
export const CLS_REQUEST_HEADER = Symbol('cls:request:header');

/**
 * 本次请求的Cookie参数在CLS上下文中存储的Key
 */
export const CLS_REQUEST_COOKIE = Symbol('cls:request:cookie');
