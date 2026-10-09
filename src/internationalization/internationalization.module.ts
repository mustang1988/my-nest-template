import { join } from 'node:path';
import { ConfigService } from '@nestjs/config';
import { Global, Module } from '@nestjs/common';
import { Ii18nConfiguration } from '../configuration/interface/i18n-configuration.interface';
import { AcceptLanguageResolver, CookieResolver, I18nJsonLoader, I18nModule, QueryResolver } from 'nestjs-i18n';

/**
 * 国际化模块
 *
 * - 全局模块
 */
@Global()
@Module({
  imports: [
    I18nModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const i18nConfig = configService.getOrThrow<Required<Ii18nConfiguration>>('i18n');
        return {
          fallbackLanguage: i18nConfig.fallbackLanguage,
          loader: I18nJsonLoader,
          loaderOptions: {
            path: join(__dirname, 'translations'),
            watch: true,
          },
        };
      },
      resolvers: [new CookieResolver(['language', 'lang']), new QueryResolver(['language', 'lang']), new AcceptLanguageResolver()],
    }),
  ],
})
export class InternationalizationModule {}
