'use client';
import React from 'react';
import { Card, CardBody } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { AddBotIcon } from "../app/icon/addboticon";
const BotCard = (props: {onPress: Function}) => {
  return (
    <Card
      className="border-none w-[316px] h-[400px] bg-[#FFF] rounded-[16px] p-2"
      shadow="sm"
      isPressable
      onPress={() => {
        props.onPress();
      }}
    >
      <CardBody className="overflow-visible p-0 bg-[#F3F4F6] h-[400px] flex justify-center items-center">
        <AddBotIcon className="" />
      </CardBody>
    </Card>
  );
};

export default BotCard;
