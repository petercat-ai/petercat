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
  useDisclosure,
} from '@nextui-org/react';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import SettingIcon from '@/public/icons/SettingIcon';
import { useBotDelete } from '@/hooks/useBot';

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
        className="border-none max-h-[166px]"
        shadow="sm"
        isPressable
        onPress={() => router.push(`/chat/${bot.id}`)}
      >
        <CardHeader className="justify-between ">
          <div className="flex gap-5">
            <Avatar isBordered radius="full" size="md" src={bot.avatar!} />
            <div className="flex flex-col gap-1 items-start justify-center">
              <h4 className="text-small font-semibold leading-none text-default-600">
                {bot.name}
              </h4>

              {bot?.label && (
                <h5 className="text-small tracking-tight text-default-400">
                  #{bot.label}
                </h5>
              )}
            </div>
          </div>
          <Dropdown
            classNames={{
              base: 'before:bg-default-200',
              content: 'min-w-[100px]',
            }}
          >
            <DropdownTrigger>
              <Button isIconOnly variant="light" size="sm" className="w-[24px]">
                <SettingIcon />
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Static Actions">
              <DropdownItem
                key="edit"
                onClick={() => router.push(`/factor/edit/${bot.id}`)}
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
        </CardHeader>
        <CardBody className="px-3 py-0 text-small text-default-400">
          <p>{bot.description}</p>
        </CardBody>
        <Divider />
        <CardFooter>
          <span className="text-default-400 text-[12px]">
            Edited {dayjs(bot.updated_at).format('YYYY-MM-DD HH:mm')}
          </span>
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
