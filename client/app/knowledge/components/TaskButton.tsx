import I18N from '@/app/utils/I18N';
import {
  Button,
  Checkbox,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Spinner,
} from '@nextui-org/react';
import { useEffect, useState } from 'react';
import { useRestartTask, useTaskList } from '@/app/hooks/useRAG';
import { TaskList } from './TaskList';
import { Pagination } from '@nextui-org/react';
import LoadingIcon from '@/public/icons/LoadingIcon';
import { PageParams, RAGTask } from '@/app/services/RAGController';
import MySpinner from '@/components/Spinner';

const statusOptions = [
  { value: 'pending', label: I18N.components.TaskButton.dengDaiZhong },
  { value: 'running', label: I18N.components.TaskButton.ruKuZhong },
  { value: 'failed', label: I18N.components.TaskButton.shiBai },
  { value: 'pending_retry', label: I18N.components.TaskButton.chongXinZhiXing },
];

const TaskButton = ({ space_id }: { space_id: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [pageParams, setPageParams] = useState<PageParams<RAGTask>>({
    page: 1,
    page_size: 10,
    eq_conditions: { space_id: space_id },
  });
  const { data, isLoading: isTaskLoading, refetch } = useTaskList(pageParams);
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);
  const {
    isLoading: isRestartLoading,
    restartTask,
    isSuccess,
  } = useRestartTask();

  useEffect(() => {
    refetch();
    setSelectedTaskIds([]);
  }, [isSuccess]);
  return (
    <Popover isOpen={isOpen} onOpenChange={setIsOpen} placement="bottom">
      <PopoverTrigger>
        <Button className="bg-gray-200 text-gray-500 text-sm rounded-full px-4 py-2">
          {I18N.components.TaskButton.chaKanRenWu}
        </Button>
      </PopoverTrigger>
      <PopoverContent style={{ maxHeight: '400px', overflowY: 'auto' }}>
        <div className="p-4 w-[480px] flex flex-col gap-4">
          <div className="flex flex-wrap gap-4 justify-center">
            {statusOptions.map((option) => (
              <Checkbox
                key={option.value}
                value={option.value}
                isSelected={
                  (pageParams.eq_conditions?.status ?? '') === option.value
                }
                color="default"
                onChange={() => {
                  setPageParams((prevParams) => {
                    const newConditions = { ...prevParams.eq_conditions };
                    if (option.value === prevParams.eq_conditions?.status) {
                      delete newConditions.status;
                    } else {
                      newConditions.status = option.value;
                    }
                    return {
                      ...prevParams,
                      eq_conditions: newConditions,
                      page: 1,
                      page_size: 10,
                    };
                  });
                }}
              >
                {option.label}
              </Checkbox>
            ))}
          </div>
          <MySpinner loading={isTaskLoading || isRestartLoading}>
            <TaskList
              tasks={data?.items || []}
              handleCheckBoxChange={(
                id: string,
                status: 'success' | 'failed' | 'running' | 'pending',
                isSelected: boolean,
              ) => {
                if (isSelected && status === 'failed') {
                  setSelectedTaskIds((prevSelected) => [...prevSelected, id]);
                } else {
                  setSelectedTaskIds((prevSelected) =>
                    prevSelected.filter((taskId) => taskId !== id),
                  );
                }
              }}
            />
          </MySpinner>
          {selectedTaskIds.length > 0 && (
            <Button
              onPress={() => restartTask(selectedTaskIds)}
              className="bg-[#3F3F46] text-[#FFFFFF] rounded-full px-4 py-2"
              startContent={
                <div className="animate-spin">
                  <LoadingIcon />
                </div>
              }
            >
              {I18N.components.TaskButton.chongShiSuoXuanRen}</Button>
          )}
          {data && (
            <Pagination
              className="flex justify-center items-center p-[0] w-full mt-[16px]"
              total={data.total_pages}
              page={pageParams.page}
              size="sm"
              onChange={(page) => {
                setPageParams((prevParams) => ({
                  ...prevParams,
                  page: page,
                }));
              }}
              classNames={{
                cursor: 'bg-gray-700',
              }}
            />
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default TaskButton;
