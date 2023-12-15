'use client';

import { NavbarBrand, Navbar as NextNavbar, Image, NavbarContent, NavbarItem, Link, Button, Tabs, Tab, Card } from '@nextui-org/react';
import { usePathname } from 'next/navigation';

export function Navbar() {
  const pathname = usePathname();
  const navs = [{
    id: "market",
    label: "市场",
    href: '/'
  }, {
    id: "factory",
    label: "工厂",
    href: '/factory/create'
  }];

  if (pathname === '/factory/create') {
    return null;
  }

  return (
    <NextNavbar>
      <NavbarBrand>
        <Link href="/">
          <Image src="/images/logo.png" alt="botcombo" width={215} height={54}/>
        </Link>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <Tabs items={navs}>
          {(item) => (
            <Tab key={item.id} title={<Link href={item.href}>{item.label}</Link>} />
          )}
        </Tabs>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          <Link href="#">Login</Link>
        </NavbarItem>
        <NavbarItem>
          <Button as={Link} color="primary" href="#" variant="flat">
            Sign Up
          </Button>
        </NavbarItem>
      </NavbarContent>
    </NextNavbar>
  );
}
