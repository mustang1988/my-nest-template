import { IRabbitmqConfiguration } from '@pgu/configuration';

/**
 * Rabbitmq客户端配置选项
 */
export interface IRabbitmqClientOptions extends Required<IRabbitmqConfiguration> {
  /**
   * 名称
   */
  name: string;
}
