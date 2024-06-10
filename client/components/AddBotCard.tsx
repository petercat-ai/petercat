'use client';
import React from 'react';
import { Card, CardBody } from '@nextui-org/react';
import { AddBotIcon } from "@/public/icons/AddBotIcon";
const BotCard = (props: {onPress: Function}) => {
  return (
    <Card
      className="border-none w-full max-h-[400px] bg-[#FFF] rounded-[16px] p-2"
      shadow="none"
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
