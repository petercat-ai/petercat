'use client';
import { Tables } from '@/types/database.types';
import React, { useState } from 'react';
import { isEmpty, map } from 'lodash';
import BotCard from '@/components/BotCard';
import { useBotList } from '@/app/hooks/useBot';
import FullPageSkeleton from '@/components/FullPageSkeleton';
import BotList from '../components/BotList';
import { useSearch } from '@/app/contexts/SearchContext';
import { Assistant } from 'petercat-lui';

declare type Bot = Tables<'bots'>;

const ASSISTANT_API_HOST = process.env.NEXT_PUBLIC_API_DOMAIN;

export default function Home() {
  const { search } = useSearch();
  const [visible, setVisible] = useState(false);
  const [currentBot, setCurrentBot] = useState<string>('');
  let { data: bots, isLoading, error } = useBotList(false, search);

  if (isLoading) {
    return <FullPageSkeleton />;
  }
  if (error) {
    return <div>Error loading bots!{error.message}</div>;
  }

  const handleCardClick = (id: string) => {
    setVisible(true);
    setCurrentBot(id);
  };

  const onClose = () => {
    setVisible(false);
  };

  return (
    <div>
      <div className="mx-auto">
        <div className="mt-8">
          <div className="grid grid-flow-row-dense gap-4 my-8 justify-items-center px-[20px] grid-cols-4">
            <BotList type="list" />
            {!isEmpty(bots) &&
              map(bots, (bot: Bot) => (
                <BotCard
                  key={bot.id}
                  bot={bot}
                  handleCardClick={handleCardClick}
                />
              ))}
          </div>
        </div>
      </div>
      <Assistant
        apiDomain={ASSISTANT_API_HOST}
        showBubble={false}
        token={currentBot}
        isVisible={visible}
        onClose={onClose}
      />
    </div>
  );
}
