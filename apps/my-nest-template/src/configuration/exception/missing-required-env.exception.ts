/**
 * 缺少必须环境变量配置异常
 */
export class MissingRequiredEnvException extends Error {
  constructor(envName: string, options?: ErrorOptions) {
    super(`缺少必须环境变量: ${envName}`, options ?? { cause: envName });
  }
}
