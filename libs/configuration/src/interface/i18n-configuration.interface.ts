/**
 * 国际化配置
 */
export interface Ii18nConfiguration {
  /**
   * 国际化回退语言
   *
   * 当请求提交的语言不在以支持的语言列表中时, 回退到该配置项指定的语言进行国际化
   */
  fallbackLanguage?: string;
}
