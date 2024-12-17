'use client';
import I18N from '@/app/utils/I18N';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Link, Tabs, Tab, Input, Button } from '@nextui-org/react';
import { usePathname } from 'next/navigation';
import Profile from './User';
import { ShopIcon } from '@/public/icons/ShopIcon';
import { SpaceIcon } from '@/public/icons/SpaceIcon';
import { SearchIcon } from '@/public/icons/SearchIcon';
import { AddIcon } from '@/public/icons/AddIcon';
import { useGlobal } from '@/app/contexts/GlobalContext';
import LanguageSwitcher from '@/components/LangSwitcher';

export function Navbar() {
  const { setSearch } = useGlobal();
  const [inputValue, setInputValue] = useState('');

  const router = useRouter();
  const pathname = usePathname();
  const navs = [
    {
      id: 'factory',
      label: I18N.components.Navbar.kongJian,
      href: '/factory/list',
      icon: <SpaceIcon />,
    },
    {
      id: 'market',
      label: I18N.components.Navbar.shiChang,
      href: '/market',
      icon: <ShopIcon />,
    },
  ];

  if (pathname.includes('/factory/edit')) {
    return null;
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      setSearch(inputValue);
    }
  };
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    if (event.target.value === '') {
      setSearch('');
    }
  };
  const handleClear = () => {
    setInputValue('');
    setSearch('');
  };
  return (
    <div className="flex bg-[#F3F4F6] py-[20px] px-[24px] min-w-[900px] mb-[16px] z-[99]">
      <div className="flex mr-[0px]">
        <Link href="/">
          <img src="/images/logo.svg" alt="petercat" width={115} height={32} />
        </Link>
        <Tabs
          items={navs}
          variant="underlined"
          selectedKey={pathname === '/market' ? 'market' : 'factory'}
          classNames={{
            base: 'bg-[#F3F4F6] rounded-full ml-[32px]',
            tabList: 'gap-0',
            tabContent:
              'group-data-[selected=true]:bg-[#FAE4CB] rounded-full px-4 py-1 h-10 leading-10',
          }}
        >
          {(item) => (
            <Tab
              key={item.id}
              className="px-0"
              title={
                <Link
                  className="text-[#000] group-data-[selected=true]:text-[#000]"
                  href={item.href}
                >
                  {item.icon}
                  {item.label}
                </Link>
              }
            />
          )}
        </Tabs>
      </div>
      <div className="flex-grow mx-[48px]">
        <Input
          onChange={handleChange}
          isClearable
          radius="lg"
          onKeyDown={handleKeyDown}
          onClear={handleClear}
          placeholder={I18N.components.Navbar.qingShuRuKaPian}
          classNames={{
            input: ['bg-transparent', 'h-10'],
            inputWrapper: [
              'shadow-none',
              'bg-[#E5E7EB]',
              'hover:bg-default-200/70',
              'focus-within:!bg-default-200/50',
              'rounded-full',
              'py-0',
              '!cursor-text',
              'h-10',
            ],
          }}
          startContent={
            <SearchIcon className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
          }
        />
      </div>
      <div className="ml-[48px] flex items-center">
        {pathname !== '/' && <LanguageSwitcher theme="light" />}
        {pathname.includes('/factory/list') && (
          <Button
            onPress={() => router.push(`/factory/edit?id=new`)}
            className="bg-[#3F3F46] text-[#FFFFFF] rounded-full px-4 py-2 mr-[16px]"
            startContent={<AddIcon />}
          >
            {I18N.components.Navbar.chuangJianJiQiRen}
          </Button>
        )}
        {pathname === '/' && <LanguageSwitcher />}

        <Profile />
      </div>
    </div>
  );
}
