'use client';
import { Tables } from '@/types/database.types';
import React, { useEffect } from 'react';
import { isEmpty, map } from 'lodash';
import BotCard from '@/components/BotCard';

import { useBotList } from '@/app/hooks/useBot';
import FullPageSkeleton from '@/components/FullPageSkeleton';
import BotList from "../components/BotList";
import { useSearch } from '@/app/contexts/SearchContext';

declare type Bot = Tables<'bots'>;

export default function Home() {
  const { search } = useSearch();
  let { data: bots, isLoading, error } = useBotList(false, search);

  if (isLoading) {
    return <FullPageSkeleton />;
  }
  if (error) {
    return <div>Error loading bots!{error.message}</div>;
  }

  return (
    <div>
      <div className="container mx-auto">
        <div className="mt-8">
          

          <div className="grid grid-flow-row-dense gap-4 my-8 justify-items-center px-[20px] grid-cols-4">
            <BotList type='list'/>
            {!isEmpty(bots) &&
              map(bots, (bot: Bot) => <BotCard key={bot.id} bot={bot} />)}
          </div>
        </div>
      </div>
    </div>
  );
}
