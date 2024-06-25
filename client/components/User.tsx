'use client';
import { useRouter } from 'next/navigation';
import { Avatar, Button, Link } from '@nextui-org/react';
import useUser from '../app/hooks/useUser';
import { LoginIcon } from '@/public/icons/LoginIcon';

export default function Profile() {
  const router = useRouter();
  const { data: user, status } = useUser();
  const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN;
  if (!user || status !== "success") {
    return (
      <Button
        onPress={() => router.push(`${apiDomain}/api/auth/login`)}
        className="bg-[#3F3F46] text-[#FFFFFF] rounded-full px-4 py-2"
        startContent={<LoginIcon />}
      >
        登录
      </Button>
    );
  }

  return (<Avatar src={user.picture!} alt={user.name!} classNames={{
    icon: "w-[40px] h-[40px]",
  }}/>);
}
