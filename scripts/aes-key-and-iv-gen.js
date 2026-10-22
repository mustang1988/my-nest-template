/**
 * 随机aes-256-cbc加密密钥和iv生成脚本
 *
 * 使用方式
 * ```bash
 * node aes-key-and-iv-gen.js
 * ```
 */
{
  const { randomBytes } = require('node:crypto');
  const key = randomBytes(32);
  const iv = randomBytes(16);
  console.log(`
#########################################################################
# 随机aes-256-cbc加密密钥和iv生成                                       #
#########################################################################
AES_KEY=${key.toString('hex')}
AES_IV=${iv.toString('hex')}
`);
}
