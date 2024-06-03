'use client';
import { Tables } from '@/types/database.types';
import React, { useState }  from 'react';
import { map } from 'lodash';
import AddBotCard from '@/components/AddBotCard';
import { useBotEdit } from '@/app/hooks/useBot';
import { 
  useDisclosure,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter, } from '@nextui-org/react';
import {StoreIcon} from "../app/icon/storeicon";
import { useBotList } from '@/app/hooks/useBot';
import BotItem from "./BotItem";

declare type Bot = Tables<'bots'>;

const BotList = (props: {type : 'nav' | 'list'}) => {
  const { type } = props;
  const { data: bots } = useBotList(true);
  const [ selectedBot , setSelectedBot] = useState('');
  const [ selectedBotName , setSelectedBotName] = useState('');

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const {
    updateBot: onUpdateBot,
  } = useBotEdit();
  return (
    <>
      { type === 'nav' && <Button onPress={onOpen} className='bg-[#3F3F46] text-[#FFFFFF] rounded-full px-4 py-2' startContent={<StoreIcon/>}>上架机器人</Button> } 
      { type === 'list' && <AddBotCard onPress={onOpen}/>} 
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}
        scrollBehavior="inside"
        radius="lg"
        size='xl'
        classNames={{
        body: "w-[568px] bg-white p-[16px]"
      }}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">选择机器人</ModalHeader>
              <ModalBody className='h-[500px] h-auto'>
                {map(bots, (bot: Bot) => <BotItem bot={bot} selectedId={selectedBot} onPress={(botId: string, botName: string) => {
                  setSelectedBot(botId);
                  setSelectedBotName(botName);
                }}/>)}
              </ModalBody>
              <ModalFooter>
                <Button className="bg-gray-700 rounded-[20px] w-[118px]" color="primary" onPress={() => {
                  onUpdateBot({
                    id: selectedBot,
                    name: selectedBotName,
                    public: true
                  })
                  onClose();
                }}>
                  上架机器人
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
    
  );
};

export default BotList;
