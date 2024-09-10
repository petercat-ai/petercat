'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { Tables } from '@/types/database.types';
import { isEmpty, map } from 'lodash';
import BotCard from '@/components/BotCard';
import { useBotList } from '@/app/hooks/useBot';
import FullPageSkeleton from '@/components/FullPageSkeleton';
import { useSearch } from '@/app/contexts/SearchContext';
import { Assistant } from '@petercatai/assistant';
import { useFingerprint } from '../hooks/useFingerprint';
import PublishBotEntity from '@/components/PublishBotEntity';
import Crash from '@/components/Crash';

declare type Bot = Tables<'bots'>;

const ASSISTANT_API_HOST = process.env.NEXT_PUBLIC_API_DOMAIN;

export default function Home() {
  const { search } = useSearch();
  const [visible, setVisible] = useState(false);
  const [isComplete, setComplete] = useState(false);
  const [currentBot, setCurrentBot] = useState<string>('');
  const { data: bots, isLoading, error } = useBotList(false, search);
  const [userInfo, setUserInfo] = useState<string | null>(null);
  const { data } = useFingerprint();

  useEffect(() => {
    setUserInfo(sessionStorage.getItem('userInfo'));
  }, []);

  const isOpening = useMemo(
    () => !userInfo && (isLoading || !isComplete),
    [isComplete, isLoading, userInfo],
  );

  useEffect(() => {
    if (data) {
      sessionStorage.setItem('userInfo', JSON.stringify(data?.visitorId));
    }
  }, [data]);

  const handleCardClick = (id: string) => {
    setVisible(true);
    setCurrentBot(id);
  };

  const onClose = () => setVisible(false);

  if (isOpening) {
    return (
      <FullPageSkeleton
        type="OPENING"
        loop={false}
        onComplete={() => setComplete(true)}
      />
    );
  }

  if (isLoading) {
    return <FullPageSkeleton />;
  }

  if (error) {
    return <Crash />;
  }

  return (
    <div>
      <div className="grid grid-flow-row-dense gap-8 justify-items-center px-[40px] grid-cols-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        <PublishBotEntity area="list" />
        {!isEmpty(bots) &&
          map(bots, (bot: Bot) => (
            <BotCard key={bot.id} bot={bot} handleCardClick={handleCardClick} />
          ))}
      </div>
      <Assistant
        apiDomain={ASSISTANT_API_HOST}
        apiUrl="/api/chat/stream_qa"
        showBubble={false}
        token={currentBot}
        isVisible={visible}
        onClose={onClose}
      />
    </div>
  );
}
