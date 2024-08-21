'use client';
import React from 'react';
import { Card, CardBody } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { AddBotIcon } from '@/public/icons/AddBotIcon';

const BotCard = () => {
  const router = useRouter();

  return (
    <Card
      className="border-none w-full max-h-[400px] bg-[#FFF] rounded-[16px] p-2 h-[384px] rounded-[8px]"
      isPressable
      onClick={() => router.push(`/factory/edit/new`)}
    >
      <CardBody className="overflow-visible p-0 bg-gradient-to-b from-[rgba(255,255,255,0.65)] to-white bg-[#F3F4F6] h-[400px] flex justify-center items-center rounded-[8px]">
        <AddBotIcon />
      </CardBody>
    </Card>
  );
};

export default BotCard;
