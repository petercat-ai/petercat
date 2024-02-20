'use client';
import { Tables } from '@/types/database.types';
import React from 'react';
import { isEmpty, map } from 'lodash';
import { Card, CardBody, Spinner, Image } from '@nextui-org/react';
import BotCard from './components/BotCard';
import { useBotList } from '@/hooks/useBot';
import { useRouter } from 'next/navigation';

declare type Bot = Tables<'bots'>;

const FullPageSkeleton = () => {
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 z-50 flex justify-center items-center bg-white bg-opacity-75">
      <Spinner />
    </div>
  );
};

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
    <div className="container mx-auto max-w-[1024px] ">
      <div className="mt-8">
        <div className="text-left font-semibold font-['PingFang SC'] text-[22px]">
          已创建的机器人
        </div>

        <div className="grid grid-flow-row-dense grid-cols-4 gap-4 my-8">
          <Card
            className="border-none max-h-[166px]"
            shadow="sm"
            isPressable
            onPress={() => router.push(`/factory/edit/new`)}
          >
            <div className="flex justify-center items-center h-screen">
              <div className="p-8 w-[244px] flex flex-col items-center justify-center">
                <img
                  alt="create new"
                  className="w-[60px] h-[60px]"
                  src="/images/create-btn.svg"
                />
                <span className="text-center text-default-500">
                  创建新的机器人
                </span>
              </div>
            </div>
          </Card>
          {!isEmpty(bots) &&
            map(bots, (bot: Bot) => <BotCard key={bot.id} bot={bot} />)}
        </div>
      </div>
    </div>
  );
}
