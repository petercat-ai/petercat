'use client';
import { Tables } from '@/types/database.types';
import React from 'react';
import { isEmpty, map } from 'lodash';
import BotCard from '@/components/BotCard';

import { useBotList } from '@/app/hooks/useBot';
import FullPageSkeleton from '@/components/FullPageSkeleton';
import BotList from "../components/BotList";
declare type Bot = Tables<'bots'>;

export default function Home() {
  const { data: bots, isLoading, error } = useBotList();
  if (isLoading) {
    return <FullPageSkeleton />;
  }
  if (error) {
    return <div>Error loading bots!{error.message}</div>;
  }

  return (
    <div>
      <div className="container mx-auto max-w-[1440px]">
        <div className="mt-8">
          

          <div className="grid grid-flow-row-dense grid-cols-4 gap-8 my-8">
            <BotList type='list'/>
            {!isEmpty(bots) &&
              map(bots, (bot: Bot) => <BotCard key={bot.id} bot={bot} />)}
          </div>
        </div>
      </div>
    </div>
  );
}
