import { isEmpty, isInteger, isNil, isNumber } from 'lodash';

/**
 * 环境变量值加载工具类
 */
export class EnvValueLoadUtil {
  /**
   * 加载可选字符串类型环境变量
   * @param name 环境变量名称
   * @param defaultValue 默认值
   * @returns 环境变量值
   */
  static loadOptionalString(name: string, defaultValue?: string): string | undefined {
    return process.env[name] ?? defaultValue;
  }

  /**
   * 加载必填字符串类型环境变量
   * @param name 环境变量名称
   * @param defaultValue 默认值
   * @returns 环境变量值
   */
  static loadRequiredString(name: string): string {
    const value = process.env[name];
    if (isNil(value) || isEmpty(value)) {
      throw new Error(`Missing required env: ${name}`);
    }
    return value;
  }

  /**
   * 加载可选整数类型环境变量
   * @param name 环境变量名称
   * @param defaultValue 默认值
   * @returns 环境变量值
   */
  static loadOptionalInteger(name: string, defaultValue?: number): number {
    const envValue = process.env[name] ?? defaultValue;
    if (isInteger(Number(envValue))) {
      return Number(envValue);
    }
    throw new Error(`Not integer env: ${name}`);
  }

  /**
   * 加载必填整数类型环境变量
   * @param name 环境变量名称
   * @param defaultValue 默认值
   * @returns 环境变量值
   */
  static loadRequiredInteger(name: string): number {
    const envValue = process.env[name];
    if (envValue) {
      if (isInteger(Number(envValue))) {
        return Number(envValue);
      }
      throw new Error(`Not integer env: ${name}`);
    }
    throw new Error(`Missing required env: ${name}`);
  }

  /**
   * 加载可选布尔类型环境变量
   * @param name 环境变量名称
   * @param defaultValue 默认值
   * @returns 环境变量值
   */
  static loadOptionalBoolean(name: string, defaultValue?: boolean): boolean {
    const envValue = process.env[name] ?? defaultValue;
    if (envValue === 'true' || envValue === 'false') {
      return envValue === 'true';
    }
    throw new Error(`Not boolean env: ${name}`);
  }

  /**
   * 加载必填布尔类型环境变量
   * @param name 环境变量名称
   * @param defaultValue 默认值
   * @returns 环境变量值
   */
  static loadRequiredBoolean(name: string): boolean {
    const envValue = process.env[name];
    if (envValue) {
      if (envValue === 'true' || envValue === 'false') {
        return envValue === 'true';
      }
      throw new Error(`Not boolean env: ${name}`);
    }
    throw new Error(`Missing required env: ${name}`);
  }

  /**
   * 加载可选数值类型环境变量
   * @param name 环境变量名称
   * @param defaultValue 默认值
   * @returns 环境变量值
   */
  static loadOptionalNumber(name: string, defaultValue?: number): number {
    const envValue = process.env[name] ?? defaultValue;
    if (isNumber(Number(envValue))) {
      return Number(envValue);
    }
    throw new Error(`Not number env: ${name}`);
  }

  /**
   * 加载必填数值类型环境变量
   * @param name 环境变量名称
   * @param defaultValue 默认值
   * @returns 环境变量值
   */
  static loadRequiredNumber(name: string): number {
    const envValue = process.env[name];
    if (envValue) {
      if (isNumber(Number(envValue))) {
        return Number(envValue);
      }
      throw new Error(`Not number env: ${name}`);
    }
    throw new Error(`Missing required env: ${name}`);
  }
}
