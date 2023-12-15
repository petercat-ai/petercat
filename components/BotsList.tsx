'use client';
import { Tables } from '@/types/database.types';
import React, { useEffect, useState } from 'react';
import { isEmpty, map } from 'lodash';
import { Avatar, Card, Image, CardBody, Input, Spinner, useInput, CardFooter } from '@nextui-org/react';
import { useRouter } from 'next/navigation'

declare type Bots = Tables<'bots'>[];
declare type Bot = Tables<'bots'>;

const BotCard = (props: { bot: Bot }) => {
  const { bot } = props;
  const router = useRouter()

  return (
    <Card shadow="sm" isPressable onPress={() => router.push(`/chat/${bot.id}`)}>
      <CardBody className="overflow-visible p-0 flex-initial">
        <Image
          shadow="sm"
          radius="lg"
          width="100%"
          alt={bot.name!}
          className="w-full object-cover h-[140px]"
          src={bot.avatar!}
        />
      </CardBody>
      <CardFooter className="text-small justify-between flex-col flex-1">
        <div className="flex w-full text-small justify-between pb-2">
          <span>{bot.name}</span>
          {bot?.label && <span className="text-default-500">#{bot.label}</span>}
        </div>

        <div className="flex-1 w-full border-t-1 border-zinc-100/50 pt-2 text-left text-gray-700">
          {bot.description}
        </div>
      </CardFooter>
    </Card>
  );
};

const FullPageSkeleton = () => {
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 z-50 flex justify-center items-center bg-white bg-opacity-75">
      <Spinner />
    </div>
  );
};

const BotsList = () => {
  const [bots, setBots] = useState<Bots>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/bot/list')
      .then((res) => res.json())
      .then((data) => {
        setBots(data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Failed to fetch bots', error);
        setError(error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <FullPageSkeleton />;
  }
  if (error) {
    return <div>Error loading bots!</div>;
  }

  return (
    <div className='mt-8'>
      <div className="text-center text-purple-500 text-base font-semibold font-['PingFang SC']">
        <div className="uppercase">Bot-market</div>
        <div className="m-1 leading-[62px] text-indigo-950 text-[50px]">人才市场</div>
      </div>

      <div className="grid grid-flow-row-dense grid-cols-3 gap-8 my-8">
        {!isEmpty(bots) &&
          map(bots, (bot: Bot) => <BotCard key={bot.id} bot={bot} />)}
        </div>
    </div>
  );
};
export default BotsList;
