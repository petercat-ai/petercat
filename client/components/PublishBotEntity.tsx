'use client';
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
      toast.success('上架成功');
      onClose();
    }
  }, [editSuccess]);

  useEffect(() => {
    if (editError) {
      toast.error(`上架失败${editError.message}`);
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
                coming soon, 请先前往 GitHub
                <a
                  href="https://github.com/petercat-ai/petercat/issues"
                  target="_blank"
                >
                  Issue 区
                </a>
                给我们提一个 Issue，留下宁的机器人信息
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
              上架机器人
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
                选择机器人
              </ModalHeader>
              <ModalBody className="h-[500px] h-auto">
                {isLoading && <Spinner key="loading" />}
                {isEmpty(botList) && !isLoading && (
                  <div key="empty" className="text-center">
                    暂无未上架的机器人
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

export default PublishBotEntity;
