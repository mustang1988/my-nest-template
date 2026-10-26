import { ConfigModule } from '@nestjs/config';
import { Global, Module } from '@nestjs/common';
import configurationLoader from './configuration-loader';

/**
 * 配置模块
 *
 * - 全局模块
 */
@Global()
@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, load: [configurationLoader], ignoreEnvFile: true })],
})
export class ConfigurationModule {}
