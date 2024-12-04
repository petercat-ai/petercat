'use client';
import I18N from '@/app/utils/I18N';
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
import {
  useBotDelete,
  useGetBotBoundRepos,
  useGetBotRagTask,
} from '@/app/hooks/useBot';
import CloudIcon from '@/public/icons/CloudIcon';
import MinusCircleIcon from '@/public/icons/MinusCircleIcon';
import { TaskStatus } from '@/types/task';
import ErrorBadgeIcon from '@/public/icons/ErrorBadgeIcon';
import CheckBadgeIcon from '@/public/icons/CheckBadgeIcon';
import LoadingIcon from '@/public/icons/LoadingIcon';
import { RagTask } from '@/app/services/BotsController';
import CardGithubIcon from '@/public/icons/CardGithubIcon';
import CardHomeIcon from '@/public/icons/CardHomeIcon';
import CardCartIcon from '@/public/icons/CardCartIcon';

declare type Bot = Tables<'bots'>;

const BotInfoIconList = (props: { bot: Bot }) => {
  const { bot } = props;
  const { data } = useGetBotBoundRepos(bot.id);
  // 判断机器人是否被安装到组件上
  const showHomeIcon = bot.domain_whitelist && bot.domain_whitelist.length > 0;
  const showCartIcon = bot.public;
  const showGithubIcon = data && Array.isArray(data) && data.length > 0;
  const texts = [
    showGithubIcon ? I18N.components.BotCard.gITHU : '',
    showHomeIcon ? I18N.components.BotCard.guanWang : undefined,
    showCartIcon ? I18N.components.Navbar.shiChang : undefined,
  ].filter(Boolean);
  const toolTipText = I18N.template?.(I18N.components.BotCard.yiZaiTEX, { val1: texts.join('、') });
  const isSingle = texts.length === 1;
  return (
    <Tooltip
      content={toolTipText}
      classNames={{
        base: [
          // arrow color
          'before:bg-[#3F3F46] dark:before:bg-white',
        ],
        content: ['py-2 px-4 rounded-lg  shadow-xl text-white', 'bg-[#3F3F46]'],
      }}
    >
      <div className="flex flex-row">
        <div className="z-[9]">{showGithubIcon && <CardGithubIcon />}</div>
        <div className={`${isSingle ? '' : '-ml-1.5'} z-[8]`}>
          {showHomeIcon && <CardHomeIcon />}
        </div>
        <div className={`${isSingle ? '' : '-ml-1.5'} z-[7]`}>
          {showCartIcon && <CardCartIcon />}
        </div>
      </div>
    </Tooltip>
  );
};

const BotCard = (props: { bot: Bot }) => {
  const [isHovered, setIsHovered] = useState(false);
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
            <div
              className="absolute inset-0 bg-white backdrop-blur-[150px] rounded-[8px]"
              style={{
                background:
                  'linear-gradient(180deg, rgba(255, 255, 255, 0.7) 0%, #FFFFFF 100%)',
              }}
            ></div>
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
            <div
              className={`${
                isHovered ? 'opacity-0' : 'hover:opacity-100'
              } transition-all absolute bottom-0 w-full flex items-center justify-center`}
            >
              <BotInfoIconList bot={bot}></BotInfoIconList>
            </div>
          </div>
          <div
            className="z-10 opacity-0 rounded-[8px] hover:opacity-100 w-full backdrop-blur-xl transition-all bg-gradient-to-b from-[rgba(255,255,255,0.65)] to-white absolute flex items-center justify-center"
            style={{ height: 'calc(100% - 24px)' }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="flex items-center gap-10 mt-[12px]">
              <Tooltip
                showArrow
                placement="top"
                content={I18N.components.BotCard.tiaoShi}
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
                  alt={I18N.components.BotCard.tiaoShi}
                  onClick={() => router.push(`/factory/edit?id=${bot.id}`)}
                  className="z-10 cursor-pointer"
                />
              </Tooltip>
              <Tooltip
                showArrow
                placement="top"
                content={I18N.components.BotCard.gengXinZhiShiKu}
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
                  alt={I18N.components.BotCard.gengXinZhiShi}
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
                {I18N.components.BotCreateFrom.shanChuJiQiRen}
              </ModalHeader>
              <ModalBody>
                <p>
                  {I18N.components.BotCard.queRenYaoShanChu}
                  {bot.name}
                  {I18N.components.BotCard.maShanChuHouJiang}
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  {I18N.components.BotCard.guanBi}
                </Button>
                <Button
                  color="danger"
                  isLoading={isLoading}
                  onPress={() => onDelete(bot?.id)}
                >
                  {I18N.components.BotCreateFrom.queRen}
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
