export interface IRedisConfiguration {
  host: string;
  port: number;
  password: string;
  username?: string;
  db: number;
}
