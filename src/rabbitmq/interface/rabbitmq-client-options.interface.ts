import { IRabbitmqConfiguration } from '../../configuration/interface/rabbitmq-configuration.interface';

/**
 * Rabbitmq客户端配置选项
 */
export interface IRabbitmqClientOptions extends Required<IRabbitmqConfiguration> {
  /**
   * 名称
   */
  name: string;
}
