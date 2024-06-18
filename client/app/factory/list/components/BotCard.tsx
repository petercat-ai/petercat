'use client';
import { Tables } from '@/types/database.types';
import React, { useEffect, useState } from 'react';
import {
  Card,
  CardBody,
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
        className="border-none w-[316px] h-[400px] bg-[#FFF] rounded-[16px] p-2"
        shadow="sm"
        isPressable
        data-hover="true"
        onPress={() => router.push(`/factory/edit/${bot.id}`)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardBody className="overflow-visible p-0 flex-initial">
          <Image
            shadow="none"
            loading="eager"
            radius="lg"
            width="100%"
            alt={bot.name!}
            className="rounded-[8px] opacity-100 w-full object-cover h-[268px] w-[300px]"
            src={
              !isHovered
                ? bot.avatar!
                : 'https://mdn.alipayobjects.com/huamei_yhboz9/afts/img/A*SF3YSYtzYksAAAAAAAAAAAAADlDCAQ/original'
            }
          />
        </CardBody>
        <CardBody className="flex flex-row justify-between pt-4">
          <div className="flex items-end">
            <div className="leading-8 h-8 font-semibold text-2xl">
              {bot.name}
            </div>
          </div>
        </CardBody>
        <CardBody className="py-0 text-small text-default-400">
          <p className="my-0 overflow-hidden text-ellipsis line-clamp-2">
            {bot.description}
          </p>
        </CardBody>
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
