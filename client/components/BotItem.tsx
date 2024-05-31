'use client';
import { Tables } from '@/types/database.types';
import React  from 'react';
declare type Bot = Tables<'bots'>;

const BotItem = (props: {bot: Bot, selectedId: string, onPress: Function}) => {
  const {
    bot,
    onPress,
    selectedId
  } = props;
  const className = `cursor-pointer flex h-[68px] rounded-[8px] bg-gray-100 px-[12px] py-[10px] border-2 border-gray-100 ${selectedId === bot.id ? ' border-gray-700 bg-gradient-to-r from-[#FAE4CB80] to-[#F3F4F680]' : ''} `
  return (
    <div onClick={() => {
      onPress(bot.id);
    }} className={className}>
      <img className='rounded-[50%] w-[48px] h-[48px]' src={bot.avatar || ''} />
      <div className='pl-[12px]'>
        <div className='text-gray-800 leading-6 text-sm font-extrabold '>{bot.name}</div>
        <div className='text-gray-500 leading-5 text-xs overflow-hidden font-normal text-ellipsis line-clamp-1'>{bot.description}</div>
      </div>
    </div>
    
  );
};

export default BotItem;
