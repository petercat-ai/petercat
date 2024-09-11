import React from 'react';
import { useState } from 'react';
import LangIcon from '../public/icons/LangIcon';
import I18N, { getCurrentLang, LangEnum } from '@/app/utils/I18N';

// const curLang = getCurrentLang();

const LanguageSwitcher = () => {
  const [currentLanguage, setCurrentLanguage] = useState<LangEnum>(
    LangEnum['en-US'],
  );

  const toggleLanguage = () => {
    const newLanguage =
      currentLanguage === LangEnum['zh-CN']
        ? LangEnum['en-US']
        : LangEnum['zh-CN'];
    setCurrentLanguage(newLanguage);
    if (I18N.setLang) {
      I18N.setLang(newLanguage);
    }
  };

  return (
    <button
      onClick={toggleLanguage}
      className="bg-white/[0.15] transition-colors hover:bg-white/[0.3] text-white rounded-full  w-[40px] h-[40px] mx-[16px] flex items-center justify-center"
    >
      <LangIcon style={{ width: '20px', height: '20px' }} />
    </button>
  );
};

export default LanguageSwitcher;
