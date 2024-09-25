import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import I18N from '@/app/utils/I18N';
import Cookies from 'js-cookie';
import { useSearchParams, useRouter } from 'next/navigation';

interface GlobalContextProps {
  search: string;
  language: string;
  setSearch: (search: string) => void;
  setLanguage: (lang: string) => void;
}

const GlobalContext = createContext<GlobalContextProps | undefined>(undefined);

export const languages = [
  { value: 'zh-CN', label: '中文简体' },
  { value: 'zh-TW', label: '中文繁體' },
  { value: 'en', label: ' English' },
  { value: 'ja', label: '日本語' },
  { value: 'ko', label: '한국어' },
];

export const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [search, setSearch] = useState('');
  const [language, setLanguage] = useState('zh-CN');
  const searchParams = useSearchParams();
  const router = useRouter();
  const updateLanguage = useCallback(
    (newLang: string) => {
      setLanguage(newLang);
      Cookies.set('language', newLang);
      if (I18N.setLang) {
        I18N.setLang(newLang);
      }
    },
    [I18N],
  );

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

  useEffect(() => {
    if (I18N.setLang) {
      I18N.setLang(language);
    }
    // Update URL query parameters
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('lang', language);
    router.push(`?${newSearchParams.toString()}`);
  }, [language]);

  return (
    <GlobalContext.Provider
      value={{ search, setSearch, language, setLanguage }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobal = () => {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error('useGlobal must be used within a GlobalProvider');
  }
  return context;
};
