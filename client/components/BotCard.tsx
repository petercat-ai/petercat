'use client';
import { Tables } from '@/types/database.types';
import React from 'react';
import { Card, Image, CardBody, CardFooter, Tooltip } from '@nextui-org/react';
import { useRouter } from 'next/navigation';

declare type Bot = Tables<'bots'>;

const BotCard = (props: {
  bot: Bot;
  handleCardClick?: (id: string) => void;
}) => {
  const { bot, handleCardClick } = props;
  const router = useRouter();

  return (
    <Card
      className="border-none w-full bg-[#FFF] rounded-[16px] p-2 h-[384px]"
      isPressable
      shadow="none"
      data-hover="true"
    >
      <CardBody
        className="overflow-visible flex-initial p-0 flex-1"
        onClick={() => {
          handleCardClick?.(bot?.id);
        }}
      >
        <div
          className="relative overflow-hidden w-full h-full bg-cover bg-center rounded-[8px]"
          style={{ backgroundImage: `url(${bot.avatar})` }}
        >
          <div
            className="absolute inset-0 bg-white backdrop-blur-[150px] rounded-[8px]"
            style={{
              background:
                'linear-gradient(180deg, rgba(255, 255, 255, 0.7) 0%, #FFFFFF 100%)',
            }}
          ></div>
          <div className="flex justify-center items-center h-full">
            <Image
              shadow="none"
              loading="eager"
              radius="lg"
              width="100px"
              alt={bot.name!}
              className="w-24 h-24"
              src={bot.avatar!}
            />
          </div>
        </div>
        <div className="z-10 opacity-0 rounded-[8px] hover:opacity-100 w-full h-full backdrop-blur-xl transition-all bg-gradient-to-b from-[rgba(255,255,255,0.65)] to-white absolute flex items-center justify-center">
          <Image src="./images/chat.svg" />
        </div>
      </CardBody>
      <CardFooter className="text-small justify-between flex-col my-4 p-0 px-3 min-h-[84px]">
        <div className="flex w-full text-small justify-between pb-2">
          <span className="leading-8 h-8 font-semibold text-2xl whitespace-nowrap overflow-hidden text-ellipsis">
            {bot.name}
          </span>
          <div className="flex items-center gap-2 shrink-0">
            <Tooltip
              content="Insights"
              classNames={{
                base: [
                  // arrow color
                  'before:bg-[#3F3F46] dark:before:bg-white',
                ],
                content: [
                  'py-2 px-4 rounded-lg  shadow-xl text-white',
                  'bg-[#3F3F46]',
                ],
              }}
            >
              <img
                onClick={(e) => {
                  e?.preventDefault();
                  router.push(
                    `/insight?repo=${bot.repo_name}&name=${bot.name}`,
                  );
                }}
                className="w-[20px] h-[20px] cursor-pointer"
                src="/images/statistic.svg"
              />
            </Tooltip>
          </div>
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
