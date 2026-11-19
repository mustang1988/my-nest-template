import { Config } from 'casdoor-nodejs-sdk';

/**
 * Casdoor配置
 */
export interface ICasdoorConfiguration extends Config {
  /**
   * Casdoor接口接入点
   */
  endpoint: string;

  /**
   * 当前服务对应Casdoor的应用名称
   */
  appName: string;

  /**
   * 当前服务对应Casdoor的组织名称
   */
  orgName: string;

  /**
   * 当前服务对应Casdoor的应用的OIDC客户端ID
   */
  clientId: string;

  /**
   * 当前服务对应Casdoor的应用的OIDC客户端密钥
   */
  clientSecret: string;

  /**
   * Casdoor证书
   */
  certificate: string;
}
