/**
 * @file 多语言工具
 * @author https://github.com/alibaba/kiwi/blob/master/kiwi-demo/src/I18N.ts
 */

import kiwiIntl from 'kiwi-intl';
import enLangs from '../../.kiwi/en';
import zhCNLangs from '../../.kiwi/zh-CN';
import zhWTLangs from '../../.kiwi/zh-TW';
import jaLangs from '../../.kiwi/ja';
import koLangs from '../../.kiwi/ko';

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
  'zh-TW': zhWTLangs,
  ja: jaLangs,
  ko: koLangs,
};

const defaultLang = 'zh-CN';

const I18N = kiwiIntl.init(defaultLang, langs);

export default I18N;
