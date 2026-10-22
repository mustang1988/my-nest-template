/**
 * 字符串AES加密转换器配置选项
 */
export interface IStringAesEncryptValueTransformerOptions {
  /**
   * aes-256-cbc加密密钥
   *
   * 长度32字节的16进制字符串
   */
  key?: string;

  /**
   * aes-256-cbc加密iv
   *
   * 长度16字节的16进制字符串
   */
  iv?: string;
}
