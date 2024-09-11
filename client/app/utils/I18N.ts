/**
 * @file 多语言工具
 * @author https://github.com/alibaba/kiwi/blob/master/kiwi-demo/src/I18N.ts
 */

import kiwiIntl from 'kiwi-intl';
import enUsLangs from '../../.kiwi/en-US';
import zhCNLangs from '../../.kiwi/zh-CN';

export enum LangEnum {
  'zh-CN' = 'zh-CN',
  'en-US' = 'en-US',
}

const langs = {
  'en-US': enUsLangs,
  'zh-CN': zhCNLangs,
};
// 从 Cookie 中取语言值, 默认为 zh-CN
const defaultLang = 'en-US';

let curLang;
if (Object.keys(langs).indexOf(defaultLang) > -1) {
  curLang = defaultLang;
} else {
  // 如果没有对应的语言文件, 置为中文
  curLang = 'zh-CN';
}

const I18N = kiwiIntl.init(curLang, langs);

export default I18N;
