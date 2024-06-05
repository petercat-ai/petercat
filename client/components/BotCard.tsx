'use client';
import { Tables } from '@/types/database.types';
import React, { useState } from 'react';
import { Card, Image, CardBody, CardFooter } from '@nextui-org/react';
import { useRouter } from 'next/navigation';

declare type Bot = Tables<'bots'>;

const BotCard = (props: {
  bot: Bot;
  handleCardClick?: (id: string) => void;
}) => {
  const { bot, handleCardClick } = props;
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      className="border-none w-[316px] h-[400px] bg-[#FFF] rounded-[16px] p-2 mx-10"
      shadow="sm"
      isPressable
      data-hover="true"
      onClick={(e) => {
        e.preventDefault();
        handleCardClick?.(bot?.id);
      }}
      onMouseEnter={() => {
        setIsHovered(true);
      }}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardBody className="overflow-visible p-0 flex-initial">
        <Image
          shadow="none"
          loading="eager"
          radius="lg"
          width="100%"
          alt={bot.name!}
          className="rounded-[8px] opacity-100 w-full object-cover h-[268px] w-[300px]"
          src={
            !isHovered
              ? bot.avatar!
              : 'https://mdn.alipayobjects.com/huamei_yhboz9/afts/img/A*4Mx7SJk91esAAAAAAAAAAAAADlDCAQ/original'
          }
        />
      </CardBody>
      <CardFooter className="text-small justify-between flex-col flex-1 mt-4">
        <div className="flex w-full text-small justify-between pb-2">
          <span className="leading-8 h-8 font-semibold text-2xl">
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
