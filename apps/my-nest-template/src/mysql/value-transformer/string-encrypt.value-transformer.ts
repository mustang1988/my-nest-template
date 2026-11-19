import { ValueTransformer } from 'typeorm';
import { createCipheriv, createDecipheriv } from 'crypto';
import { EnvValueLoadUtil } from 'src/configuration/util/env-value-load.util';
import { IStringAesEncryptValueTransformerOptions } from '../interface/string-encrypt-value-transformer-options.interface';

/**
 * 字符串AES加密转换器
 *
 * 数据入库前进行aes-256-cbc加密, 将加密后的密文存入数据库
 *
 * 数据查询后进行aes-256-cbc解密, 返回解密后的原文
 *
 * 需要注意: 环境变量 AES_KEY 和 AES_IV 在项目首次启动加密数据入库前必须先确定, 运行期间不允许修改
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

    /**
     * aes-256-cbc 加密
     */
    const cipher = createCipheriv('aes-256-cbc', this.key, this.iv);
    let encrypted = cipher.update(value, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }

  from(value: string | null): string | null {
    if (value === null) {
      return value;
    }

    /**
     * aes-256-cbc 解密
     */
    const decipher = createDecipheriv('aes-256-cbc', this.key, this.iv);
    let decrypted = decipher.update(value, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
}
