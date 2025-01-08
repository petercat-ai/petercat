'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { Tables } from '@/types/database.types';
import { isEmpty, map } from 'lodash';
import BotCard from '@/components/BotCard';
import { useBotList } from '@/app/hooks/useBot';
import FullPageSkeleton from '@/components/FullPageSkeleton';
import { useGlobal } from '@/app/contexts/GlobalContext';
import { Assistant, useUser } from '@petercatai/assistant';
import { useFingerprint } from '../hooks/useFingerprint';
import Crash from '@/components/Crash';

declare type Bot = Tables<'bots'>;

const ASSISTANT_API_HOST = process.env.NEXT_PUBLIC_API_DOMAIN;

export default function Market() {
  const { search } = useGlobal();
  const [visible, setVisible] = useState(false);
  const [currentBot, setCurrentBot] = useState<string>('');
  const { data: bots, isLoading, error } = useBotList(false, search);

  const handleCardClick = (id: string) => {
    setVisible(true);
    setCurrentBot(id);
  };

  const onClose = () => setVisible(false);

  if (isLoading) {
    return <FullPageSkeleton />;
  }

  if (error) {
    return <Crash />;
  }

  return (
    <div>
      <div className="grid grid-flow-row-dense gap-8 justify-items-center px-[40px] grid-cols-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {!isEmpty(bots) &&
          map(bots, (bot: Bot) => (
            <BotCard key={bot.id} bot={bot} handleCardClick={handleCardClick} />
          ))}
      </div>
      {typeof window !== 'undefined' && (
        <Assistant
          apiDomain={ASSISTANT_API_HOST}
          apiUrl="/api/chat/stream_qa"
          showBubble={false}
          token={currentBot}
          isVisible={visible}
          onClose={onClose}
        />
      )}
    </div>
  );
}
