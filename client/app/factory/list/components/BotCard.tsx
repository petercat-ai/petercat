'use client';
import { Tables } from '@/types/database.types';
import React, { useEffect, useState } from 'react';
import {
  Card,
  CardBody,
  CardFooter,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Image,
  useDisclosure,
  Tooltip,
} from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { useBotDelete, useGetBotRagTask } from '@/app/hooks/useBot';
import CloudIcon from '@/public/icons/CloudIcon';
import MinusCircleIcon from '@/public/icons/MinusCircleIcon';
import { TaskStatus } from '@/types/task';
import ErrorBadgeIcon from '@/public/icons/ErrorBadgeIcon';
import CheckBadgeIcon from '@/public/icons/CheckBadgeIcon';
import LoadingIcon from '@/public/icons/LoadingIcon';
import { RagTask } from '@/app/services/BotsController';

declare type Bot = Tables<'bots'>;

const BotCard = (props: { bot: Bot }) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { bot } = props;
  const router = useRouter();
  const { deleteBot, isLoading, isSuccess } = useBotDelete();
  const { data: taskInfo } = useGetBotRagTask(bot.id, true, false);

  useEffect(() => {
    if (isSuccess) {
      onClose();
    }
  }, [isSuccess]);

  const onDelete = (id: string) => {
    deleteBot(id);
  };
  const renderTaskStatusIcon = (taskList: RagTask[]) => {
    const status = taskList.find((task) => task.status === TaskStatus.ERROR)
      ? TaskStatus.ERROR
      : taskList.every((task) =>
          [
            TaskStatus.CANCELLED,
            TaskStatus.COMPLETED,
            TaskStatus.ERROR,
          ].includes(task.status as TaskStatus),
        )
      ? TaskStatus.COMPLETED
      : 'others';
    if (status === TaskStatus.COMPLETED) {
      return <CheckBadgeIcon />;
    }
    if (status === TaskStatus.ERROR) {
      return <ErrorBadgeIcon />;
    }
    return (
      <span className="animate-spinner-ease-spin">
        <LoadingIcon />
      </span>
    );
  };

  return (
    <>
      <Card
        className="border-none w-full bg-[#FFF] rounded-[16px] p-2 h-[384px]"
        isPressable={false}
        shadow="none"
        data-hover="true"
      >
        <CardBody className="overflow-visible flex-initial p-0 flex-1">
          <div
            className="relative overflow-hidden w-full h-full bg-cover bg-center rounded-[8px]"
            style={{ backgroundImage: `url(${bot.avatar})` }}
          >
            <div className="absolute inset-0 bg-white bg-opacity-70 backdrop-blur-[70px] rounded-[8px]"></div>
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
            <div className="flex items-center gap-10">
              <Tooltip
                showArrow
                placement="top"
                content="调试"
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
                <Image
                  src="../images/debug.svg"
                  alt={'调试'}
                  onClick={() => router.push(`/factory/edit/${bot.id}`)}
                  className="z-10 cursor-pointer"
                />
              </Tooltip>
              <Tooltip
                showArrow
                placement="top"
                content="更新知识库"
                classNames={{
                  base: [
                    // arrow color
                    'before:bg-[#3F3F46] dark:before:bg-white',
                  ],
                  content: [
                    'py-2 px-4 rounded-lg shadow-xl text-white',
                    'bg-[#3F3F46]',
                  ],
                }}
              >
                <Image
                  src="../images/refresh.svg"
                  alt={'更新知识'}
                  className="z-10 cursor-pointer"
                />
              </Tooltip>
            </div>
          </div>
        </CardBody>
        <CardFooter className="text-small justify-between flex-col my-4 p-0 px-3 h-[84px]">
          <div className="flex w-full text-small justify-between pb-2">
            <span className="leading-8 h-8 font-semibold text-2xl whitespace-nowrap overflow-hidden text-ellipsis">
              {bot.name}
            </span>
            <div className="flex items-center gap-2 shrink-0">
              <div className="w-[32px] h-[32px] p-[7px] flex items-center rounded-[16px] bg-[#F4F4F5]">
                {bot.public ? <CloudIcon /> : <MinusCircleIcon />}
              </div>
              <div className="w-[32px] h-[32px] p-[7px] flex items-center rounded-[16px] bg-[#F4F4F5]">
                {renderTaskStatusIcon(taskInfo ?? [])}
              </div>
            </div>
          </div>

          <div className="flex-1 w-full border-zinc-100/50 text-left text-gray-400 font-[400] text-[14px] leading-[22px] ">
            <p className="my-0 overflow-hidden text-ellipsis line-clamp-2">
              {bot.description}
            </p>
          </div>
        </CardFooter>
      </Card>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                删除机器人
              </ModalHeader>
              <ModalBody>
                <p>
                  确认要删除 「{bot.name}」 吗？删除后将无法恢复，请谨慎操作。
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  关闭
                </Button>
                <Button
                  color="danger"
                  isLoading={isLoading}
                  onPress={() => onDelete(bot?.id)}
                >
                  确认
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default BotCard;
