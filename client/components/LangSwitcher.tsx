import React from 'react';
import LangIcon from '../public/icons/LangIcon';
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@nextui-org/react';
import { useGlobal, languages } from '@/app/contexts/GlobalContext';

interface LangProps {
  theme?: 'light' | 'dark';
}
const LanguageSwitcher = (props: LangProps) => {
  const { theme = 'dark' } = props;
  const { language, setLanguage } = useGlobal();

  // Handle language change
  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang);
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <div
          className={`transition-colors rounded-full w-[40px] h-[40px] mx-[16px] flex items-center justify-center cursor-pointer  ${
            theme === 'light'
              ? 'bg-[#E5E7EB] hover:bg-white/[0.15]  text-gray-700'
              : 'bg-white/[0.15] hover:bg-white/[0.3] text-white'
          }`}
        >
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
