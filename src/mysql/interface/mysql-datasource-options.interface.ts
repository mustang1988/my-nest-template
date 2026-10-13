import { IMySQLConfiguration } from '../../configuration/interface/mysql-configuration.interface';

/**
 * MySQL数据源配置选项
 */
export interface IMySQLDataSourceOptions extends IMySQLConfiguration {
  /**
   * 名称
   */
  name: string;
}
