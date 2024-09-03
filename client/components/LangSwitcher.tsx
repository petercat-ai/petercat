import React from 'react';
import i18next from 'i18next';
import { useState, useEffect } from 'react';
import LangIcon from '../public/icons/LangIcon';
import { usePathname } from 'next/navigation';
const LanguageSwitcher = () => {
  const [currentLanguage, setCurrentLanguage] = useState(i18next.language);

  const pathname = usePathname();

  // useEffect(() => {
  //   const handleLanguageChange = (lng: string) => {
  //     setCurrentLanguage(lng);
  //   };

  //   i18next.on('languageChanged', handleLanguageChange);

  //   return () => {
  //     i18next.off('languageChanged', handleLanguageChange);
  //   };
  // }, []);

  const toggleLanguage = () => {
    const newLanguage = currentLanguage === 'en' ? 'zh' : 'en';
    i18next.changeLanguage(newLanguage);
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
