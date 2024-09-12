'use client';
import I18N from '@/app/utils/I18N';
import React, { useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { Button, Tooltip } from '@nextui-org/react';
import { useGetBotRagTask } from '@/app/hooks/useBot';
import { convertToLocalTime } from '@/app/utils/time';
import BookIcon from '@/public/icons/BookIcon';
import { TaskStatus } from '@/types/task';
import RefreshIcon from '@/public/icons/RefreshIcon';
import { useBotTask } from './TaskContext';

type IProps = {
  botId: string;
  onClick: () => void;
  mode: 'configItem' | 'pageHeader';
};

const KnowledgeBtn = (props: IProps) => {
  const { onClick, botId, mode } = props;
  const { setTaskProfile } = useBotTask();
  const [shouldGetTask, setShouldGetTask] = React.useState<boolean>(!!botId);
  const [taskLoading, setTaskLoading] = React.useState<boolean>(true);
  const [allowShowChunkList, setAllowShowChunkList] =
    React.useState<boolean>(false);

  const { data: taskList } = useGetBotRagTask(botId, shouldGetTask, true);
  const taskCnt = taskList?.length ?? 0;

  // compute task running status by taskList
  useEffect(() => {
    if (!taskList) return;
    let completeTaskCnt = 0;
    taskList.forEach((item) => {
      if (
        [TaskStatus.CANCELLED, TaskStatus.COMPLETED, TaskStatus.ERROR].includes(
          item.status as TaskStatus,
        )
      ) {
        completeTaskCnt++;
      }
    });
    if (completeTaskCnt > 0) {
      setAllowShowChunkList(true);
    }
    const taskRunning = taskCnt === completeTaskCnt ? false : true;
    setTaskLoading(taskRunning);
    setTaskProfile({ running: taskRunning });
  }, [taskList]);

  // close the interval query
  useEffect(() => {
    return () => {
      setShouldGetTask(false);
    };
  }, []);

  if (mode === 'pageHeader') {
    return (
      <>
        {taskList && taskList?.length > 0 ? (
          <span
            className="font-sf-pro text-xs font-normal leading-5 text-left"
            style={{ color: '#9CA3AF' }}
          >
            {I18N.components.KnowledgeBtn.zuiJinGengXinYu}
            {convertToLocalTime(taskList[taskCnt - 1]?.created_at ?? '')}
          </span>
        ) : null}
        <Button
          className="rounded-full bg-gray-700 text-white"
          size="sm"
          isLoading={taskLoading}
          variant="flat"
          startContent={taskLoading ? null : <RefreshIcon />}
          onClick={(e) => {
            e.preventDefault();
            // TODO: reload knowledge
          }}
        >
          {taskLoading ? (
            I18N.components.Knowledge.zhiShiKuGengXin
          ) : (
            <Tooltip content="Coming Soon">
              <span>{I18N.components.KnowledgeBtn.gengXinZhiShiKu}</span>
            </Tooltip>
          )}
        </Button>
      </>
    );
  }
  if (mode === 'configItem') {
    return (
      <>
        <Button
          radius="full"
          className="bg-[#F1F1F1] text-gray-500"
          startContent={allowShowChunkList ? <BookIcon /> : null}
          isLoading={!allowShowChunkList}
          onClick={() => {
            onClick();
          }}
        >
          {taskLoading
            ? I18N.components.Knowledge.zhiShiKuGengXin
            : I18N.components.KnowledgeBtn.chaKanZhiShiKu}
        </Button>
        {taskList && taskList?.length > 0 ? (
          <span
            className="font-sf-pro text-xs font-normal leading-5 text-left"
            style={{ color: '#9CA3AF' }}
          >
            {I18N.components.KnowledgeBtn.zuiJinGengXinYu}
            {convertToLocalTime(taskList[taskCnt - 1]?.created_at ?? '')}
          </span>
        ) : null}
      </>
    );
  }
  return <></>;
};

export default KnowledgeBtn;
