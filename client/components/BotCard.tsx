'use client';
import { Tables } from '@/types/database.types';
import React from 'react';
import { Card, Image, CardBody, CardFooter } from '@nextui-org/react';

declare type Bot = Tables<'bots'>;

const BotCard = (props: {
  bot: Bot;
  handleCardClick?: (id: string) => void;
}) => {
  const { bot, handleCardClick } = props;

  return (
    <Card
      className="border-none w-full bg-[#FFF] rounded-[16px] p-2 h-[384px]"
      isPressable
      shadow="none"
      data-hover="true"
      onClick={(e) => {
        e.preventDefault();
        handleCardClick?.(bot?.id);
      }}
    >
      <CardBody className="overflow-visible flex-initial p-0">
        <Image
          shadow="none"
          loading="eager"
          radius="lg"
          width="100%"
          alt={bot.name!}
          className="rounded-[8px] opacity-100 w-full object-cover h-[268px]"
          src={bot.avatar!}
        />
        <div
          className="z-10 opacity-0 rounded-[8px] hover:opacity-100 w-full h-full backdrop-blur-xl transition-all bg-gradient-to-b from-[rgba(255,255,255,0.65)] to-white absolute flex items-center justify-center"
        >
          <Image src="./images/chat.svg" />
        </div>
      </CardBody>
      <CardFooter className="text-small justify-between flex-col flex-1 mt-4 p-0 px-3">
        <div className="flex w-full text-small justify-between pb-2">
          <span className="leading-8 h-8 font-semibold text-2xl whitespace-nowrap overflow-hidden text-ellipsis">
            {bot.name}
          </span>
        </div>

        <div className="flex-1 w-full border-zinc-100/50 text-left text-gray-400 font-[400] text-[14px] leading-[22px]">
          <p className="my-0 overflow-hidden text-ellipsis line-clamp-2">
            {bot.description}
          </p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default BotCard;
