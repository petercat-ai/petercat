'use client';
import { Tables } from '@/types/database.types';
import React from 'react';
import { isEmpty, map } from 'lodash';
import { Card, CardBody, Spinner, Image } from '@nextui-org/react';
import BotCard from './components/BotCard';
import AddBotCard from './components/AddBotCard';

import { useBotList } from '@/app/hooks/useBot';
import { useRouter } from 'next/navigation';
import FullPageSkeleton from '@/components/FullPageSkeleton';

declare type Bot = Tables<'bots'>;

export default function List() {
  const router = useRouter();
  const { data: bots, isLoading, error } = useBotList(true);
  if (isLoading) {
    return <FullPageSkeleton />;
  }
  if (error) {
    return <div>Error loading bots!{error.message}</div>;
  }

  return (
    <div className="container mx-auto max-w-[1440px] ">
      <div className="mt-8">
        <div className="grid grid-flow-row-dense grid-cols-4 gap-4 my-8">
          <AddBotCard />
          {!isEmpty(bots) &&
            map(bots, (bot: Bot) => <BotCard key={bot.id} bot={bot} />)}
        </div>
      </div>
    </div>
  );
}
