/**
 * 环境变量配置值无效异常
 */
export class InvalidEnvException extends Error {
  constructor(message?: string, options?: ErrorOptions) {
    super(message ?? '环境变量配置错误', options);
  }
}

export class InvalidNumberEnvException extends InvalidEnvException {
  constructor(envName: string, options?: ErrorOptions) {
    super(`环境变量配置错误: ${envName}, 应配置为有效的数值`, options ?? { cause: envName });
  }
}

export class InvalidIntegerEnvException extends InvalidEnvException {
  constructor(envName: string, options?: ErrorOptions) {
    super(`环境变量配置错误: ${envName}, 应配置为有效的整数`, options ?? { cause: envName });
  }
}

export class InvalidBooleanEnvException extends InvalidEnvException {
  constructor(envName: string, options?: ErrorOptions) {
    super(`环境变量配置错误: ${envName}, 应配置为有效的布尔值`, options ?? { cause: envName });
  }
}

export class InvalidUrlEnvException extends InvalidEnvException {
  constructor(envName: string, options?: ErrorOptions) {
    super(`环境变量配置错误: ${envName}, 应配置为有效的URL`, options ?? { cause: envName });
  }
}

export class InvalidHexEnvException extends InvalidEnvException {
  constructor(envName: string, options?: ErrorOptions) {
    super(`环境变量配置错误: ${envName}, 应配置为有效的16进制字符串`, options ?? { cause: envName });
  }
}
