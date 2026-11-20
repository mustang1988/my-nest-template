import { join } from 'node:path';
import { existsSync } from 'node:fs';
import { ConfigService } from '@nestjs/config';
import { Global, Module } from '@nestjs/common';
import { Ii18nConfiguration } from '@pgu/configuration';
import { AcceptLanguageResolver, CookieResolver, I18nJsonLoader, I18nModule, QueryResolver } from 'nestjs-i18n';

/**
 * 解析国际化语言包目录
 *
 * - 优先取本模块编译产物同级的translations目录(生产部署: 语言包与编译产物一同部署, 如 dist/libs/internationalization/src/translations)
 * - 不存在时回退到monorepo源码树中的语言包目录(开发模式: nest start --watch以仓库根为工作目录, 直接读取源码语言包, 修改即时生效)
 *
 * @return 语言包目录绝对路径
 */
const resolveTranslationsPath = (): string => {
  const distTranslationsPath = join(__dirname, 'translations');
  if (existsSync(distTranslationsPath)) {
    return distTranslationsPath;
  }
  return join(process.cwd(), 'libs/internationalization/src/translations');
};

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
            path: resolveTranslationsPath(),
            watch: true,
          },
        };
      },
      resolvers: [new CookieResolver(['language', 'lang']), new QueryResolver(['language', 'lang']), new AcceptLanguageResolver()],
    }),
  ],
})
export class InternationalizationModule {}
