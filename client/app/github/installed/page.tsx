'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@nextui-org/react';
import { useRouter } from 'next/navigation';

export default function GithubAppInstalled() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      redirectToLink();
    }
  }, [countdown]);

  const redirectToLink = () => {
    router.push('/factory/list');
  };

  const handleClick = () => {
    redirectToLink();
  };

  return (
    <div className="flex h-screen w-full flex-col items-center bg-white pb-16 pt-20 sm:pb-20 md:pt-36 lg:py-32">
      <p className="font-display text-4xl font-bold tracking-tight text-slate-900">
        Installation Approved
      </p>
      <p>Thank you for installing PeterCat&#x27;s GitHub App!</p>
      <p>
        Your Team will now be able to use robots for your GitHub organization!
      </p>
      <Button
        onPress={handleClick}
        className="min-w-[88px] px-4 h-10 inline-block transition-colors bg-[#3F3F46] text-[#FFFFFF] rounded-full leading-10 text-center"
      >
        Redirecting to the factory in {countdown} seconds...
      </Button>
    </div>
  );
}
