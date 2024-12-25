'use client';
import I18N from '@/app/utils/I18N';
import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react';
import { useUser } from '../app/hooks/useUser';
import GitHubIcon from '@/public/icons/GitHubIcon';
import Link from 'next/link';

export default function Profile() {
  const { user, status, actions } = useUser();

  if (!user || status !== 'success' || user.id.startsWith('client|')) {
    return (
      <Button
        onPress={actions.doLogin}
        className="min-w-[88px] px-4 h-10 inline-block transition-colors bg-[#3F3F46] text-[#FFFFFF] rounded-full leading-10 text-center"
      >
        <GitHubIcon className="inline scale-75 -translate-y-0.5" />
        {I18N.components.User.dengLu}
      </Button>
    );
  }

  const avatar = (
    <Dropdown className="cursor-pointer">
      <DropdownTrigger>
        <Avatar
          src={user.picture!}
          alt={user.name!}
          classNames={{
            icon: 'w-[40px] h-[40px]',
          }}
        />
      </DropdownTrigger>
      <DropdownMenu>
        <DropdownItem key="token">
          <Link href="/user/tokens">{I18N.components.User.tOKEN}</Link>
        </DropdownItem>
        <DropdownItem key="logout" onPress={actions.doLogout}>
          {I18N.components.User.dengChu}
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );

  return avatar;
}
