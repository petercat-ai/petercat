'use client';
import { Tables } from '@/types/database.types';
import React from 'react';
import { isEmpty, map } from 'lodash';
import BotCard from './components/BotCard';
import AddBotCard from './components/AddBotCard';

import { useBotList } from '@/app/hooks/useBot';

import FullPageSkeleton from '@/components/FullPageSkeleton';
import { useSearch } from '@/app/contexts/SearchContext';

declare type Bot = Tables<'bots'>;

export default function List() {
  const { search } = useSearch();
  let { data: bots, isLoading, error } = useBotList(true, search);
  if (isLoading) {
    return <FullPageSkeleton />;
  }
  if (error) {
    return <div>Error loading bots!{error.message}</div>;
  }

  return (
    <div className="mx-auto ">
      <div className="mt-8">
        <div className="grid grid-flow-row-dense grid-cols-4 gap-4 my-8 justify-items-center px-[20px]">
          <AddBotCard />
          {!isEmpty(bots) &&
            map(bots, (bot: Bot) => <BotCard key={bot.id} bot={bot} />)}
        </div>
      </div>
    </div>
  );
}
