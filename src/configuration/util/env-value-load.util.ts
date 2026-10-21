import { isURL } from 'class-validator';
import {
  InvalidHexEnvException,
  InvalidUrlEnvException,
  InvalidNumberEnvException,
  InvalidBooleanEnvException,
  InvalidIntegerEnvException,
} from '../exception/invalid-env.exception';
import { isBoolean, isEmpty, isInteger, isNil, isNumber } from 'lodash';
import { MissingRequiredEnvException } from '../exception/missing-required-env.exception';

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
    return process.env[name]?.trim() ?? defaultValue;
  }

  /**
   * 加载必填字符串类型环境变量
   * @param name 环境变量名称
   * @returns 环境变量值
   * @throws {MissingRequiredEnvException}
   */
  static loadRequiredString(name: string): string {
    const value = process.env[name]?.trim();
    if (isNil(value) || isEmpty(value)) {
      throw new MissingRequiredEnvException(name);
    }
    return value;
  }

  /**
   * 加载可选16进制字符串类型环境变量
   * @param name 环境变量名称
   * @param defaultValue 默认值
   * @returns 环境变量值
   */
  static loadOptionalHexString(name: string, defaultValue?: string): string | undefined {
    const str = EnvValueLoadUtil.loadOptionalString(name, defaultValue);
    const hexRegex = /^[0-9A-Fa-f]+$/;
    if (str && !hexRegex.test(str)) {
      throw new InvalidHexEnvException(name);
    }
    return str;
  }

  /**
   * 加载必填16进制字符串类型环境变量
   * @param name 环境变量名称
   * @returns 环境变量值
   * @throws {MissingRequiredEnvException}
   */
  static loadRequiredHexString(name: string): string {
    const value = process.env[name]?.trim();
    if (isNil(value) || isEmpty(value)) {
      throw new MissingRequiredEnvException(name);
    }
    const hexRegex = /^[0-9,A-F,a-f]+$/;
    if (!hexRegex.test(value)) {
      throw new InvalidHexEnvException(name);
    }
    return value;
  }

  /**
   * 加载可选整数类型环境变量
   * @param name 环境变量名称
   * @param defaultValue 默认值
   * @returns 环境变量值
   * @throws {InvalidIntegerEnvException}
   */
  static loadOptionalInteger(name: string, defaultValue?: number): number {
    const envValue = process.env[name]?.trim();
    if (envValue !== undefined && envValue === '') {
      throw new InvalidIntegerEnvException(name);
    }
    const value = envValue ?? defaultValue;
    const numberEnvValue = Number(value);
    if (!isNaN(numberEnvValue) && isInteger(numberEnvValue)) {
      return numberEnvValue;
    }
    throw new InvalidIntegerEnvException(name);
  }

  /**
   * 加载必填整数类型环境变量
   * @param name 环境变量名称
   * @returns 环境变量值
   * @throws {InvalidIntegerEnvException}
   * @throws {MissingRequiredEnvException}
   */
  static loadRequiredInteger(name: string): number {
    const envValue = process.env[name]?.trim();
    if (envValue) {
      const numberEnvValue = Number(envValue);
      if (!isNaN(numberEnvValue) && isInteger(numberEnvValue)) {
        return numberEnvValue;
      }
      throw new InvalidIntegerEnvException(name);
    }
    throw new MissingRequiredEnvException(name);
  }

  /**
   * 加载可选布尔类型环境变量
   * @param name 环境变量名称
   * @param defaultValue 默认值
   * @returns 环境变量值
   * @throws {InvalidBooleanEnvException}
   */
  static loadOptionalBoolean(name: string, defaultValue?: boolean): boolean {
    const envValue = process.env[name]?.trim() ?? defaultValue;
    if (isBoolean(envValue)) {
      return envValue;
    }
    if (envValue === 'true' || envValue === 'false') {
      return envValue === 'true';
    }
    throw new InvalidBooleanEnvException(name);
  }

  /**
   * 加载必填布尔类型环境变量
   * @param name 环境变量名称
   * @returns 环境变量值
   * @throws {InvalidBooleanEnvException}
   * @throws {MissingRequiredEnvException}
   */
  static loadRequiredBoolean(name: string): boolean {
    const envValue = process.env[name]?.trim();
    if (envValue) {
      if (envValue === 'true' || envValue === 'false') {
        return envValue === 'true';
      }
      throw new InvalidBooleanEnvException(name);
    }
    throw new MissingRequiredEnvException(name);
  }

  /**
   * 加载可选数值类型环境变量
   * @param name 环境变量名称
   * @param defaultValue 默认值
   * @returns 环境变量值
   * @throws {InvalidNumberEnvException}
   */
  static loadOptionalNumber(name: string, defaultValue?: number): number {
    const envValue = process.env[name]?.trim() ?? defaultValue;
    const numberEnvValue = Number(envValue);
    if (!isNaN(numberEnvValue) && isNumber(numberEnvValue)) {
      return numberEnvValue;
    }
    throw new InvalidNumberEnvException(name);
  }

  /**
   * 加载必填数值类型环境变量
   * @param name 环境变量名称
   * @returns 环境变量值
   * @throws {InvalidNumberEnvException}
   * @throws {MissingRequiredEnvException}
   */
  static loadRequiredNumber(name: string): number {
    const envValue = process.env[name]?.trim();
    if (envValue) {
      const numberEnvValue = Number(envValue);
      if (!isNaN(numberEnvValue) && isNumber(numberEnvValue)) {
        return numberEnvValue;
      }
      throw new InvalidNumberEnvException(name);
    }
    throw new MissingRequiredEnvException(name);
  }

  /**
   * 加载可选URL环境变量
   * @param name 环境变量名称
   * @param defaultValue 默认值
   * @returns 环境变量值
   * @throws {InvalidUrlEnvException}
   */
  static loadOptionalUrl(name: string, defaultValue?: string): string | undefined {
    const envValue = process.env[name]?.trim() ?? defaultValue;
    if (isURL(envValue as string, { require_protocol: true })) {
      return envValue;
    }
    throw new InvalidUrlEnvException(name);
  }

  /**
   * 加载必填URL环境变量
   * @param name 环境变量名称
   * @returns 环境变量值
   * @throws {InvalidUrlEnvException}
   * @throws {MissingRequiredEnvException}
   */
  static loadRequiredUrl(name: string): string {
    const envValue = process.env[name]?.trim();
    if (envValue) {
      if (!isURL(envValue, { require_protocol: true })) {
        throw new InvalidUrlEnvException(name);
      }
      return envValue;
    }
    throw new MissingRequiredEnvException(name);
  }
}
