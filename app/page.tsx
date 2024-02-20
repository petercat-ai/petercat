'use client';
import { Tables } from '@/types/database.types';
import React from 'react';
import { isEmpty, map } from 'lodash';
import { Spinner } from '@nextui-org/react';
import BotCard from '@/components/BotCard';
import { useBotList } from '@/hooks/useBot';

declare type Bot = Tables<'bots'>;

const FullPageSkeleton = () => {
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 z-50 flex justify-center items-center bg-white bg-opacity-75">
      <Spinner />
    </div>
  );
};

export default function Home() {
  const { data: bots, isLoading, error } = useBotList();
  if (isLoading) {
    return <FullPageSkeleton />;
  }
  if (error) {
    return <div>Error loading bots!{error.message}</div>;
  }

  return (
    <div className="container mx-auto max-w-[1024px]">
      <div className="mt-8">
        <div className="text-center text-purple-500 text-base font-semibold font-['PingFang SC']">
          <div className="uppercase">Bot-market</div>
          <div className="m-1 leading-[62px] text-indigo-950 text-[50px]">
            人才市场
          </div>
        </div>

        <div className="grid grid-flow-row-dense grid-cols-3 gap-8 my-8">
          {!isEmpty(bots) &&
            map(bots, (bot: Bot) => <BotCard key={bot.id} bot={bot} />)}
        </div>
      </div>
    </div>
  );
}
