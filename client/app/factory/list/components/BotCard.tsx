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
} from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { useBotDelete } from '@/app/hooks/useBot';

declare type Bot = Tables<'bots'>;

const BotCard = (props: { bot: Bot }) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { bot } = props;
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const { deleteBot, isLoading, isSuccess } = useBotDelete();

  useEffect(() => {
    if (isSuccess) {
      onClose();
    }
  }, [isSuccess]);

  const onDelete = (id: string) => {
    deleteBot(id);
  };

  return (
    <>
      <Card
        className="border-none w-full bg-[#FFF] rounded-[16px] p-2 h-[384px]"
        isPressable
        shadow="none"
        data-hover="true"
        onPress={() => router.push(`/factory/edit/${bot.id}`)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardBody className="overflow-visible flex-initial p-0">
          <Image
            shadow="none"
            loading="eager"
            radius="lg"
            width="100%"
            alt={bot.name!}
            className="rounded-[8px] opacity-100 w-full object-cover h-[268px]"
            src={bot.avatar!}
          />
          <div
            className="z-10 opacity-0 rounded-[8px] hover:opacity-100 w-full h-full backdrop-blur-xl transition-all bg-gradient-to-b from-[rgba(255,255,255,0.65)] to-white absolute flex items-center justify-center"
          >
            <Image src="./images/chat.svg" />
          </div>
        </CardBody>
        <CardFooter className="text-small justify-between flex-col flex-1 mt-4 p-0 px-3">
          <div className="flex w-full text-small justify-between pb-2">
            <span className="leading-8 h-8 font-semibold text-2xl whitespace-nowrap overflow-hidden text-ellipsis">
              {bot.name}
            </span>
          </div>

          <div className="flex-1 w-full border-zinc-100/50 text-left text-gray-400 font-[400] text-[14px] leading-[22px]">
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
