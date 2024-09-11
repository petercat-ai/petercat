/**
 * @file 多语言工具
 * @author https://github.com/alibaba/kiwi/blob/master/kiwi-demo/src/I18N.ts
 */

import kiwiIntl from 'kiwi-intl';
import enLangs from '../../.kiwi/en';
import zhCNLangs from '../../.kiwi/zh-CN';

export enum LangEnum {
  'zh-CN' = 'zh-CN',
  'zh-TW' = 'zh-TW',
  'en' = 'en',
  'ja' = 'ja',
  'ko' = 'ko',
}

const langs = {
  en: enLangs,
  'zh-CN': zhCNLangs,
};

const defaultLang = 'zh-CN';

const I18N = kiwiIntl.init(defaultLang, langs);

export default I18N;
