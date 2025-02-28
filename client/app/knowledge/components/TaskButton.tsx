import {
  Button,
  Checkbox,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Spinner,
} from '@nextui-org/react';
import { useState } from 'react';
import { useTaskList } from '@/app/hooks/useRAG';
import { TaskList } from './TaskList';
import { Pagination } from '@nextui-org/react';

const statusOptions = [
  { value: 'pending', label: '等待中' },
  { value: 'running', label: '入库中' },
  { value: 'failed', label: '失败' },
  { value: 'pending_retry', label: '重新执行' },
];

const TaskButton = ({ space_id }: { space_id: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [pageParams, setPageParams] = useState({
    page: 1,
    page_size: 10,
    eq_conditions: { space_id: space_id },
  });
  const { data, isLoading, error, refetch } = useTaskList(pageParams);
  return (
    <Popover isOpen={isOpen} onOpenChange={setIsOpen} placement="bottom">
      <PopoverTrigger>
        <Button>查看任务</Button>
      </PopoverTrigger>

      <PopoverContent style={{ maxHeight: '400px', overflowY: 'auto' }}>
        <div className="p-4 w-[480px]">
          <div className="mb-4">
            <div className="flex flex-wrap gap-4">
              {statusOptions.map((option) => (
                <Checkbox
                  key={option.value}
                  value={option.value}
                  isSelected={
                    // @ts-ignore
                    (pageParams.eq_conditions?.status ?? '') === option.value
                  }
                  color="default"
                  onChange={() => {
                    setPageParams((prevParams) => {
                      const newConditions = { ...prevParams.eq_conditions };
                      // @ts-ignore
                      if (option.value === prevParams.eq_conditions?.status) {
                        // @ts-ignore
                        delete newConditions.status;
                      } else {
                        // @ts-ignore
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
          </div>

          {isLoading ? (
            <div className="flex justify-center">
              <Spinner />
            </div>
          ) : (
            <TaskList
              tasks={data?.items || []}
              onClose={() => setIsOpen(false)}
            />
          )}
          {(data?.total_pages ?? 0) > 1 && (
            <Pagination
              className="flex justify-center items-center mt-[60px] p-[0] w-full"
              total={data?.total_pages || 1}
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
