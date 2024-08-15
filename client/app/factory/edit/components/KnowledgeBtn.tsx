'use client';
import React, { useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { Button } from '@nextui-org/react';
import { useGetRagTask } from '@/app/hooks/useBot';
import { convertToLocalTime } from '@/app/utils/time';
import BookIcon from '@/public/icons/BookIcon';
import { TaskStatus } from '@/types/task';

type IProps = {
  botId: string;
  onClick: () => void;
};

const KnowledgeBtn = (props: IProps) => {
  const { onClick, botId } = props;
  const [isPolling, setIsPolling] = React.useState<boolean>(true);
  const [taskLoading, setTaskLoading] = React.useState<boolean>(true);
  const { data: taskInfo } = useGetRagTask(botId, isPolling);

  useEffect(() => {
    if (!taskInfo) return;
    if (
      [
        TaskStatus.ON_HOLD,
        TaskStatus.NOT_STARTED,
        TaskStatus.IN_PROGRESS,
      ].includes(taskInfo.status as TaskStatus)
    ) {
      setTaskLoading(true);
    }
  }, [taskInfo]);

  useEffect(() => {
    setIsPolling(true);
    return () => {
      setIsPolling(false);
    };
  }, []);

  return (
    <>
      <Button
        radius="full"
        className="bg-[#F1F1F1] text-gray-500"
        startContent={<BookIcon />}
        isLoading={taskLoading}
        onClick={() => {
          onClick();
        }}
      >
        {taskLoading ? '知识库更新中' : '查看知识库'}
      </Button>
      {taskInfo?.created_at ? (
        <span
          className="font-sf-pro text-xs font-normal leading-5 text-left"
          style={{ color: '#9CA3AF' }}
        >
          最近更新于
          {convertToLocalTime(taskInfo?.created_at ?? '')}
        </span>
      ) : null}
    </>
  );
};

export default KnowledgeBtn;
