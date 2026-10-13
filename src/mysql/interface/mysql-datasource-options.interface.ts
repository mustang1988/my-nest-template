import { IMySQLConfiguration } from '../../configuration/interface/mysql-configuration.interface';

export interface IMySQLDataSourceOptions extends IMySQLConfiguration {
  name: string;
}
