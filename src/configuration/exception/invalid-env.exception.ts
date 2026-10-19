/**
 * 环境变量配置值无效异常
 */
export class InvalidEnvExeception extends Error {
  constructor(message?: string, options?: ErrorOptions) {
    super(message ?? '环境变量配置错误', options);
  }
}

export class InvalidNumberEnvException extends InvalidEnvExeception {
  constructor(envName: string, options?: ErrorOptions) {
    super(`环境变量配置错误: ${envName}, 应配置为有效的数值`, options);
  }
}

export class InvalidIntegerEnvException extends InvalidEnvExeception {
  constructor(envName: string, options?: ErrorOptions) {
    super(`环境变量配置错误: ${envName}, 应配置为有效的整数`, options);
  }
}

export class InvalidBooleanEnvException extends InvalidEnvExeception {
  constructor(envName: string, options?: ErrorOptions) {
    super(`环境变量配置错误: ${envName}, 应配置为有效的布尔值`, options);
  }
}

export class InvalidUrlEnvException extends InvalidEnvExeception {
  constructor(envName: string, options?: ErrorOptions) {
    super(`环境变量配置错误: ${envName}, 应配置为有效的URL`, options);
  }
}

export class InvalidHexEnvException extends InvalidEnvExeception {
  constructor(envName: string, options?: ErrorOptions) {
    super(`环境变量配置错误: ${envName}, 应配置为有效的16进制字符串`, options);
  }
}
