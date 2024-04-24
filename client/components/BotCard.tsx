'use client';
import { Tables } from '@/types/database.types';
import React from 'react';
import { Card, Image, CardBody, CardFooter } from '@nextui-org/react';
import { useRouter } from 'next/navigation';

declare type Bot = Tables<'bots'>;

const BotCard = (props: { bot: Bot }) => {
  const { bot } = props;
  const router = useRouter();

  return (
    <Card
      className="border-none"
      shadow="sm"
      isPressable
      onPress={() => router.push(`/chat/${bot.id}`)}
    >
      <CardBody className="overflow-visible p-0 flex-initial">
        <Image
          shadow="none"
          radius="lg"
          width="100%"
          alt={bot.name!}
          className="w-full object-cover h-[200px]"
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

export default BotCard;
