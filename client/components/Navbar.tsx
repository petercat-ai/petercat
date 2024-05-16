'use client';

import {
  NavbarBrand,
  Navbar as NextNavbar,
  Image,
  NavbarContent,
  NavbarItem,
  Link,
  Tabs,
  Tab,
  Input,
  Button
} from '@nextui-org/react';
import './Navbar.css';

import { usePathname } from 'next/navigation';
import Profile from './User';
import {ShopIcon} from "../app/icon/shopicon";
import {SpaceIcon} from "../app/icon/spaceicon";
import {SearchIcon} from "../app/icon/searchicon";
import {AddIcon} from "../app/icon/addicon";
export function Navbar() {
  const pathname = usePathname();
  const navs = [
    {
      id: 'market',
      label: '市场',
      href: '/',
      icon: <ShopIcon/>
    },
    {
      id: 'factory',
      label: '工厂',
      href: '/factory/list',
      icon: <SpaceIcon/>
    },
  ];

  if (pathname.includes('/factory/edit')) {
    return null;
  }

  return (
    <NextNavbar className='custom-nav-bar w-full'>
      <NavbarBrand className='custom-nav-brand w-[115px]' >
        <Link href="/">
          <Image className="opacity-100" src="/images/logo_new.svg" alt="petercat" width={114} height={32} />
        </Link>
      </NavbarBrand>
      <NavbarContent className="w-[160px] mt-0.5 custom-nav-content hidden sm:flex gap-0" justify="start">
      
        <Tabs
          items={navs}
          selectedKey={pathname === '/' ? 'market' : 'factory'}
          classNames={{
            tabContent: "group-data-[selected=true]:bg-[#FAE4CB] rounded-full px-4 py-1 h-10 leading-10" 
          }}
        >
          {(item) => (
            <Tab
              key={item.id}
              className='px-0'
              title={<Link className="text-[#000]  group-data-[selected=true]:text-[#000]"href={item.href}>{item.icon}{item.label}</Link>}
            />
          )}
        </Tabs>
      </NavbarContent>
      <NavbarContent justify="start" className="flex-grow">
      <Input
        isClearable
        radius="lg"
        classNames={{
          input: [
            "bg-transparent",
            "h-10"
          ],
          inputWrapper: [
            "shadow-none",
            "bg-[#E5E7EB]",
            "hover:bg-default-200/70",
            "focus-within:!bg-default-200/50",
            "rounded-full",
            "py-0",
            "!cursor-text",
            "h-10"
          ]
        }}
        startContent={
          <SearchIcon className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
        }
      />
      </NavbarContent>
      <NavbarContent className="w-[200px]" justify="end">
        <NavbarItem>
          <Button className='bg-[#3F3F46] text-[#FFFFFF] rounded-full px-4 py-2' startContent={<AddIcon/>}>创建机器人</Button>
        </NavbarItem>
        <NavbarItem>
          <Profile />
        </NavbarItem>
      </NavbarContent>
    </NextNavbar>
  );
}
