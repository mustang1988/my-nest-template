import { isInteger, isNumber } from 'lodash';

export class EnvValueLoadUtil {
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
