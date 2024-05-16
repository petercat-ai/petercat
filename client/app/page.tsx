'use client';
import { Tables } from '@/types/database.types';
import React from 'react';
import { isEmpty, map } from 'lodash';
import BotCard from '@/components/BotCard';
import AddBotCard from '@/components/AddBotCard';

import { useBotList } from '@/app/hooks/useBot';
import FullPageSkeleton from '@/components/FullPageSkeleton';

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
      <div className="container mx-auto max-w-[1024px]">
        <div className="mt-8">
          

          <div className="grid grid-flow-row-dense grid-cols-3 gap-8 my-8">
            <AddBotCard />
            {!isEmpty(bots) &&
              map(bots, (bot: Bot) => <BotCard key={bot.id} bot={bot} />)}
          </div>
        </div>
      </div>
    </div>
  );
}
