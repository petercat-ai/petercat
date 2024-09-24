'use client';
import { Tables } from '@/types/database.types';
import React from 'react';
import { isEmpty, map } from 'lodash';
import BotCard from './components/BotCard';

import { useBotList } from '@/app/hooks/useBot';

import FullPageSkeleton from '@/components/FullPageSkeleton';
import { useGlobal } from '@/app/contexts/GlobalContext';
import AddBotCard from '@/components/AddBotCard';
import { useRouter } from 'next/navigation';
import Crash from '@/components/Crash';

declare type Bot = Tables<'bots'>;

export default function List() {
  const { search } = useGlobal();
  let { data: bots, isLoading, error } = useBotList(true, search);
  const router = useRouter();
  if (isLoading) {
    return <FullPageSkeleton />;
  }
  if (error) {
    return <Crash />;
  }

  return (
    <div className="grid grid-flow-row-dense gap-8 justify-items-center px-[40px] grid-cols-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      <AddBotCard
        onPress={() => {
          router.push(`/factory/edit?id=new`);
        }}
      />
      {!isEmpty(bots) &&
        map(bots, (bot: Bot) => <BotCard key={bot.id} bot={bot} />)}
    </div>
  );
}
