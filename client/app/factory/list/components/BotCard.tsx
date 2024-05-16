'use client';
import { Tables } from '@/types/database.types';
import React, { useEffect } from 'react';
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Avatar,
  Divider,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Image,
  useDisclosure,
  Badge,
} from '@nextui-org/react';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import SettingIcon from '@/public/icons/SettingIcon';
import { useBotDelete } from '@/app/hooks/useBot';

declare type Bot = Tables<'bots'>;

const BotCard = (props: { bot: Bot }) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { bot } = props;
  const router = useRouter();
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
        onPress={() => router.push(`/chat/${bot.id}`)}
      >
        <CardBody className="overflow-visible p-0 flex-initial">
          <Image
            shadow="none"
            loading="eager"
            radius="lg"
            width="100%"
            alt={bot.name!}
            className="rounded-[8px] opacity-100 w-full object-cover h-[268px] w-[300px]"
            src={bot.avatar!}
          />
        </CardBody>
        <CardBody className="flex flex-row justify-between pt-4">
          <div className="flex items-end">
            <div className="leading-8 h-8 font-semibold text-2xl">
              {bot.name}
            </div>
          </div>
          <Dropdown
            classNames={{
              base: 'before:bg-default-200 justify-end',
              content: 'min-w-[100px]',
            }}
          >
            <DropdownTrigger>
              <Button isIconOnly variant="light" size="sm" className="w-[24px]">
                <SettingIcon />
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Static Actions" className='bg-[#efefef] rounded-[6px]'>
              <DropdownItem
                key="edit"
                onClick={() => router.push(`/factory/edit/${bot.id}`)}
              >
                编辑
              </DropdownItem>
              <DropdownItem
                key="delete"
                className="text-danger"
                color="danger"
                onClick={onOpen}
              >
                删除
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </CardBody>
        <CardBody className="py-0 text-small text-default-400">
          <p>{bot.description}</p>
        </CardBody>
        <Divider />
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
