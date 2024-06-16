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
      className="border-none w-full max-h-[400px] bg-[#FFF] rounded-[16px] p-2 mx-10 transition-shadow hover:shadow-lg"
      isPressable
      shadow="none"
      data-hover="true"
      onClick={(e) => {
        e.preventDefault();
        handleCardClick?.(bot?.id);
      }}
    >
      <CardBody className="overflow-visible p-0 flex-initial">
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
          className="z-10 opacity-0 hover:opacity-100 w-full h-full backdrop-blur-xl transition-all bg-gradient-to-b from-[rgba(255,255,255,0.65)] to-white absolute flex items-center justify-center"
        >
          <Image src="./images/chat.svg" />
        </div>
      </CardBody>
      <CardFooter className="text-small justify-between flex-col flex-1 mt-4">
        <div className="flex w-full text-small justify-between pb-2">
          <span className="leading-8 h-8 font-semibold text-2xl whitespace-nowrap overflow-hidden text-ellipsis">
            {bot.name}
          </span>
        </div>

        <div className="flex-1 w-full border-zinc-100/50 text-left text-[#9CA3AF] font-[400] text-[14px] leading-[22px]">
          <p className="my-0 overflow-hidden text-ellipsis line-clamp-2">
            {bot.description}
          </p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default BotCard;
