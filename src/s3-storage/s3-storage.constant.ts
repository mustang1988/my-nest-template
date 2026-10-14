import { InjectionToken } from '@nestjs/common';

/**
 * S3客户端配置IoC注入Token
 *
 * 注入的Provider泛型为: Array<IS3ClientOptions>
 */
export const S3_CLIENT_OPTIONS_TOKEN: symbol = Symbol('token:s3-client-options');

/**
 * S3客户端Map IoC注入Token
 *
 * 注入的Provider泛型为: Map<string, S3Client>
 */
export const S3_CLIENTS_MAP_TOKEN: symbol = Symbol('token:s3-clients-map');

/**
 * 获取指定名称S3存储的客户端IoC注入Token
 * @param name S3存储名称
 * @return S3存储客户端对象IoC注入Token
 */
export const getS3ClientToken = (name: string): InjectionToken => `token:s3-client:${name}`;
