export interface IMySQLConfiguration {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  charset?: string;
  timezone?: string;
  logger?: boolean;
  sync?: boolean;
}
