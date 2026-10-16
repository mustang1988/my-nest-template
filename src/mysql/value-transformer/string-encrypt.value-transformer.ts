import { ValueTransformer } from 'typeorm';
import { createCipheriv, createDecipheriv } from 'crypto';
import { EnvValueLoadUtil } from 'src/configuration/util/env-value-load.util';
import { IStringAesEncryptValueTransformerOptions } from '../interface/string-encrypt-value-transformer-options.interface';

/**
 * 字符串AES加密转换器
 */
export class StringAesEncryptValueTransformer implements ValueTransformer {
  private readonly key: Buffer;
  private readonly iv: Buffer | null;

  constructor(options?: IStringAesEncryptValueTransformerOptions) {
    const keyString = options?.key ?? EnvValueLoadUtil.loadRequiredString('AES_KEY');
    this.key = Buffer.from(keyString, 'hex');
    const ivString = options?.iv ?? EnvValueLoadUtil.loadRequiredString('AES_IV');
    this.iv = ivString ? Buffer.from(ivString, 'hex') : null;
  }

  to(value: string | null): string | null {
    if (value === null) {
      return value;
    }
    const cipher = createCipheriv('aes-256-cbc', this.key, this.iv);
    let encrypted = cipher.update(value, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }

  from(value: string | null): string | null {
    if (value === null) {
      return value;
    }
    const decipher = createDecipheriv('aes-256-cbc', this.key, this.iv);
    let decrypted = decipher.update(value, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
}
