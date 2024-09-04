'use client';
import React from 'react';
import { CardBody } from '@nextui-org/react';
import BaseBotCard from './BaseBotCard';
import { MarketIcon } from '@/public/icons/MarketIcon';

const PublishBotCard = (props: { onPress: Function }) => {
  return (
    <BaseBotCard
      onPress={() => {
        props.onPress();
      }}
    >
      <CardBody className="overflow-visible p-0 bg-gradient-to-b from-[rgba(255,255,255,0.65)] to-white bg-[#F3F4F6] h-[400px] flex justify-center items-center rounded-[8px]">
        <MarketIcon className="" />
      </CardBody>
    </BaseBotCard>
  );
};

export default PublishBotCard;
