'use client';
import { Tables } from '@/types/database.types';
import React, { useEffect, useMemo, useState } from 'react';
import { isEmpty, map } from 'lodash';
import BotCard from './components/BotCard';

import { useBotList } from '@/app/hooks/useBot';

import FullPageSkeleton from '@/components/FullPageSkeleton';
import { useGlobal } from '@/app/contexts/GlobalContext';
import AddBotCard from '@/components/AddBotCard';
import { useRouter } from 'next/navigation';
import Crash from '@/components/Crash';
import { useUser } from '@petercatai/assistant';
import { useFingerprint } from '@/app/hooks/useFingerprint';

declare type Bot = Tables<'bots'>;

const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN!;

export default function List() {
  const { search } = useGlobal();
  const { data } = useFingerprint();
  const [isComplete, setComplete] = useState(false);
  const { user, isLoading: userLoading } = useUser({
    apiDomain,
    fingerprint: data?.visitorId || '',
  });
  let { data: bots, isLoading, error } = useBotList(true, search, !!user);
  const router = useRouter();

  const isOpening = useMemo(
    () => !user || userLoading || isLoading || !isComplete,
    [isComplete, userLoading, isLoading, user],
  );

  useEffect(() => {
    console.log(' opening', isOpening);
  }, [isOpening]);

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
    <div className="grid grid-flow-row-dense gap-8 justify-items-center px-[40px] grid-cols-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      <AddBotCard
        onPress={() => {
          router.push(`/factory/edit?id=new`);
        }}
      />
      {!isEmpty(bots) &&
        map(bots, (bot: Bot) => (
          <BotCard key={bot.id} bot={bot} userId={user.id} />
        ))}
    </div>
  );
}
