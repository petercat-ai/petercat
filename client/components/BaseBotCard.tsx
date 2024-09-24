'use client';
import React from 'react';
import { Card } from '@nextui-org/react';

const BaseBotCard = (props: {
  onPress: Function;
  children: React.ReactNode;
}) => {
  return (
    <Card
      className="border-none w-full max-h-[400px] bg-[#FFF] rounded-[16px] p-2 h-[384px] rounded-[8px]"
      shadow="none"
      isPressable
      onPress={() => {
        props.onPress();
      }}
    >
      {props.children}
    </Card>
  );
};

export default BaseBotCard;
