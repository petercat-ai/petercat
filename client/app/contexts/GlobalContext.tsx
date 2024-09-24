import React, { createContext, useContext, useState } from 'react';

interface GlobalContextProps {
  search: string;
  lang: string;
  setSearch: (search: string) => void;
  setLang: (lang: string) => void;
}

const GlobalContext = createContext<GlobalContextProps | undefined>(undefined);

export const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [search, setSearch] = useState('');
  const [lang, setLang] = useState('zh-CN');

  return (
    <GlobalContext.Provider value={{ search, setSearch, lang, setLang }}>
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
