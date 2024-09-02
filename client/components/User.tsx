'use client';
import { useRouter } from 'next/navigation';
import {
  Avatar,
  Badge,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react';
import useUser from '../app/hooks/useUser';

export default function Profile() {
  const router = useRouter();
  const { data: user, status } = useUser();
  const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN;

  if (!user || status !== 'success') {
    return (
      <Button
        onPress={() => router.push(`${apiDomain}/api/auth/login`)}
        className="min-w-[100px] px-4 h-10 inline-block bg-white/[0.15] transition-colors hover:bg-white/[0.3] text-white rounded-full leading-10 text-center"
      >
        登录
      </Button>
    );
  }

  const avatar = (
    <Dropdown>
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
        <DropdownItem
          onClick={() => router.push(`${apiDomain}/api/auth/login`)}
        >
          登录
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );

  if (user.id.startsWith('client|')) {
    return (
      <Badge content="匿名" size="sm" color="default">
        {avatar}
      </Badge>
    );
  }

  return avatar;
}
