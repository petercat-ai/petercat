import React, { useEffect, useState } from 'react';
import LangIcon from '../public/icons/LangIcon';
import { useSearchParams } from 'next/navigation';
import I18N from '@/app/utils/I18N';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@nextui-org/react';

const languages = [
  { value: 'zh-CN', label: '中文简体' },
  { value: 'en', label: ' English' },
  { value: 'zh-TW', label: '中文繁體' },
  { value: 'ja', label: '日本語' },
  { value: 'ko', label: '한국어' },
];

const LanguageSwitcher = () => {
  const [language, setLanguage] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  // Helper function to set language and update I18N
  const updateLanguage = (newLang: string) => {
    setLanguage(newLang);
    Cookies.set('language', newLang);
    if (I18N.setLang) I18N.setLang(newLang);
  };

  // Get language from query params, cookies, or browser settings
  useEffect(() => {
    const langFromQuery = searchParams.get('lang');
    const cookieLang = Cookies.get('language');
    const browserLang = navigator.language;

    const defaultLang = 'zh-CN'; // Fallback language

    if (
      langFromQuery &&
      languages.some((lang) => lang.value === langFromQuery)
    ) {
      updateLanguage(langFromQuery);
    } else if (cookieLang) {
      updateLanguage(cookieLang);
    } else {
      const matchingLang =
        languages.find((lang) => lang.value === browserLang)?.value ||
        defaultLang;
      updateLanguage(matchingLang);
    }
  }, [searchParams]);

  // Handle language change
  const handleLanguageChange = (newLang: string) => {
    updateLanguage(newLang);

    // Update URL query parameters
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('lang', newLang);
    router.push(`?${newSearchParams.toString()}`);
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <div className="bg-white/[0.15] transition-colors hover:bg-white/[0.3] text-white rounded-full w-[40px] h-[40px] mx-[16px] flex items-center justify-center cursor-pointer">
          <LangIcon style={{ width: '20px', height: '20px' }} />
        </div>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Language Selection"
        disallowEmptySelection
        selectionMode="single"
        selectedKeys={[language]}
        onSelectionChange={(keys) => handleLanguageChange(`${keys.currentKey}`)}
      >
        {languages.map((item) => (
          <DropdownItem key={item.value}>{item.label}</DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};

export default LanguageSwitcher;
