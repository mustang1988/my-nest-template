/**
 * 环境变量配置值无效异常
 */
export class InvalidEnvException extends Error {
  constructor(message?: string, options?: ErrorOptions) {
    super(message ?? '环境变量配置错误', options);
  }
}

/**
 * 数值类型环境变量配置值无效异常
 */
export class InvalidNumberEnvException extends InvalidEnvException {
  constructor(envName: string, options?: ErrorOptions) {
    super(`环境变量配置错误: ${envName}, 应配置为有效的数值`, options ?? { cause: envName });
  }
}

/**
 * 整数类型环境变量配置值无效异常
 */
export class InvalidIntegerEnvException extends InvalidEnvException {
  constructor(envName: string, options?: ErrorOptions) {
    super(`环境变量配置错误: ${envName}, 应配置为有效的整数`, options ?? { cause: envName });
  }
}

/**
 * 布尔类型环境变量配置值无效异常
 */
export class InvalidBooleanEnvException extends InvalidEnvException {
  constructor(envName: string, options?: ErrorOptions) {
    super(`环境变量配置错误: ${envName}, 应配置为有效的布尔值`, options ?? { cause: envName });
  }
}

/**
 * URL类型环境变量配置值无效异常
 */
export class InvalidUrlEnvException extends InvalidEnvException {
  constructor(envName: string, options?: ErrorOptions) {
    super(`环境变量配置错误: ${envName}, 应配置为有效的URL`, options ?? { cause: envName });
  }
}

/**
 * 16进制字符串类型环境变量配置值无效异常
 */
export class InvalidHexEnvException extends InvalidEnvException {
  constructor(envName: string, options?: ErrorOptions) {
    super(`环境变量配置错误: ${envName}, 应配置为有效的16进制字符串`, options ?? { cause: envName });
  }
}
