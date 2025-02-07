'use client';
import React from 'react';
import { Tables } from '@/types/database.types';
import { useBotList } from '@/app/hooks/useBot';
import HomeIcon from '@/public/icons/HomeIcon';
import { useRouter } from 'next/router';
import { useSearchParams } from 'next/navigation';

declare type Bot = Tables<'bots'>;

export default function Insight() {
  const searchParams = useSearchParams();
  const repoName = searchParams.get('repo');
  const botName = searchParams.get('name');
  // const router = useRouter();

  return (
    <div className="flex w-full h-full flex-col bg-[#F3F4F6] min-h-screen">
      <div className="relative flex h-[72px] w-full items-center justify-between gap-2  px-6 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span
            className="flex items-center gap-2 cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              // router.back();
            }}
          >
            <HomeIcon />
            <span className="text-gray-400">{botName}</span>
          </span>
          <span className="text-gray-400">/</span>
          <span>Insight</span>
        </div>
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          Powered by
          <a
            className="text-gray-500"
            href="https://open-digger.cn/docs/user_docs/intro"
          >
            HyperCRX
          </a>
        </div>
      </div>
      <div className="pb-[42px] px-[40px] overflow-y-auto">
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-white rounded h-[607px]"></div>
          <div className="bg-white rounded h-[607px]"></div>
          <div className="bg-white rounded h-[579px]"></div>
          <div className="bg-white rounded h-[579px]"></div>
          <div className="bg-white rounded h-[500px]"></div>
          <div className="bg-white rounded h-[500px]"></div>
          <div className="bg-white rounded h-[500px] col-span-2"></div>
        </div>
      </div>
    </div>
  );
}
