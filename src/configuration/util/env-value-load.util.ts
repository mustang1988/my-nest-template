import { isInteger, isNumber } from 'lodash';

/**
 * 环境变量值加载工具类
 */
export class EnvValueLoadUtil {
  /**
   * 加载字符串类型环境变量
   * @param name 环境变量名称
   * @param defaultValue 默认值
   * @returns 环境变量值
   */
  static loadString(name: string, defaultValue?: string): string {
    const envValue = process.env[name];
    if (envValue) {
      return envValue;
    }
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    throw new Error(`Missing required env: ${name}`);
  }

  /**
   * 加载整数类型环境变量
   * @param name 环境变量名称
   * @param defaultValue 默认值
   * @returns 环境变量值
   */
  static loadInteger(name: string, defaultValue?: number): number {
    const envValue = process.env[name];
    if (envValue) {
      if (isInteger(Number(envValue))) {
        return Number(envValue);
      }
      throw new Error(`Not integer env: ${name}`);
    }
    if (defaultValue !== undefined) {
      if (isInteger(Number(defaultValue))) {
        return Number(defaultValue);
      }
      throw new Error(`Not integer default value: ${name}`);
    }
    throw new Error(`Missing required env: ${name}`);
  }

  /**
   * 加载布尔类型环境变量
   * @param name 环境变量名称
   * @param defaultValue 默认值
   * @returns 环境变量值
   */
  static loadBoolean(name: string, defaultValue?: boolean): boolean {
    const envValue = process.env[name];
    if (envValue) {
      if (envValue === 'true' || envValue === 'false') {
        return envValue === 'true';
      }
      throw new Error(`Not boolean env: ${name}`);
    }
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    throw new Error(`Missing required env: ${name}`);
  }

  /**
   * 加载数值类型环境变量
   * @param name 环境变量名称
   * @param defaultValue 默认值
   * @returns 环境变量值
   */
  static loadNumber(name: string, defaultValue?: number): number {
    const envValue = process.env[name];
    if (envValue) {
      if (isNumber(Number(envValue))) {
        return Number(envValue);
      }
      throw new Error(`Not number env: ${name}`);
    }
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    throw new Error(`Missing required env: ${name}`);
  }
}
