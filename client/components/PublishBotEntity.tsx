'use client';
import I18N from '@/app/utils/I18N';
import { Tables } from '@/types/database.types';
import React, { useEffect, useMemo, useState } from 'react';
import { filter, isEmpty, map } from 'lodash';
import { useBotEdit } from '@/app/hooks/useBot';
import { toast, ToastContainer } from 'react-toastify';
import {
  useDisclosure,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
  Tooltip,
} from '@nextui-org/react';
import { StoreIcon } from '../public/icons/StoreIcon';
import { useBotList } from '@/app/hooks/useBot';
import BotItem from './BotItem';

import 'react-toastify/dist/ReactToastify.css';
import PublishBotCard from './PublishBotCard';

declare type Bot = Tables<'bots'>;

const PublishBotEntity = (props: { area: 'nav' | 'list' }) => {
  const { area } = props;
  const [selectedBot, setSelectedBot] = useState('');
  const [selectedBotName, setSelectedBotName] = useState('');
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { data: bots, isLoading } = useBotList(true, '', isOpen);

  const botList = useMemo(() => filter(bots, (item) => !item?.public), [bots]);

  const {
    updateBot: onUpdateBot,
    isLoading: updateBotLoading,
    isSuccess: editSuccess,
    error: editError,
  } = useBotEdit();

  useEffect(() => {
    if (editSuccess) {
      toast.success(I18N.components.PublishBotEntity.shangJiaChengGong);
      onClose();
    }
  }, [editSuccess]);

  useEffect(() => {
    if (editError) {
      toast.error(I18N.components.PublishBotEntity.shangJiaShiBaiE);
    }
  }, [editError]);
  return (
    <>
      {area === 'nav' && (
        <>
          <ToastContainer />
          <Tooltip
            content={
              <span>
                {I18N.components.PublishBotEntity.cOMIN}
                <a
                  href="https://github.com/petercat-ai/petercat/issues"
                  target="_blank"
                >
                  {I18N.components.PublishBotEntity.iSSUE}
                </a>
                {I18N.components.PublishBotEntity.geiWoMenTiYi}
              </span>
            }
          >
            <Button
              disabled={true}
              key="public"
              // onPress={onOpen}
              className="bg-[#3F3F46] text-[#FFFFFF] rounded-full px-4 py-2 mr-[16px]"
              startContent={<StoreIcon />}
            >
              {I18N.components.PublishBotEntity.shangJiaJiQiRen}
            </Button>
          </Tooltip>
        </>
      )}
      {area === 'list' && <PublishBotCard onPress={onOpen} />}
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        scrollBehavior="inside"
        radius="lg"
        size="xl"
        classNames={{
          body: 'w-[568px] bg-white p-[16px]',
        }}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {I18N.components.PublishBotEntity.xuanZeJiQiRen}
              </ModalHeader>
              <ModalBody className="h-[500px] h-auto">
                {isLoading && <Spinner key="loading" />}
                {isEmpty(botList) && !isLoading && (
                  <div key="empty" className="text-center">
                    {I18N.components.PublishBotEntity.zanWuWeiShangJia}
                  </div>
                )}
                {map(botList, (bot: Bot) => (
                  <BotItem
                    key="list"
                    bot={bot}
                    selectedId={selectedBot}
                    onPress={(botId: string, botName: string) => {
                      setSelectedBot(botId);
                      setSelectedBotName(botName);
                    }}
                  />
                ))}
              </ModalBody>
              <ModalFooter>
                <Button
                  isLoading={updateBotLoading}
                  className="bg-gray-700 rounded-[20px] w-[118px]"
                  color="primary"
                  onPress={() => {
                    onUpdateBot({
                      id: selectedBot,
                      name: selectedBotName,
                      public: true,
                    });
                  }}
                >
                  {I18N.components.PublishBotEntity.shangJiaJiQiRen}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default PublishBotEntity;
