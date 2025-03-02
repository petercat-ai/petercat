import I18N from '@/app/utils/I18N';
import { RAGTask } from '@/app/services/RAGController';
import LoadingIcon from '@/public/icons/LoadingIcon';

const SuccessIcon = () => {
  return (
    <div data-svg-wrapper>
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18ZM13.8566 8.19113C14.1002 7.85614 14.0261 7.38708 13.6911 7.14345C13.3561 6.89982 12.8871 6.97388 12.6434 7.30887L9.15969 12.099L7.28033 10.2197C6.98744 9.92678 6.51256 9.92678 6.21967 10.2197C5.92678 10.5126 5.92678 10.9874 6.21967 11.2803L8.71967 13.7803C8.87477 13.9354 9.08999 14.0149 9.30867 13.9977C9.52734 13.9805 9.72754 13.8685 9.85655 13.6911L13.8566 8.19113Z"
          fill="#3F3F46"
        />
      </svg>
    </div>
  );
};
const FailedIcon = () => {
  return (
    <div className="w-5 h-5 p-1 flex-col justify-center items-center inline-flex">
      <div className="w-[18px] h-[18px] rounded-sm border-2 border-red-400" />
    </div>
  );
};
interface SubTaskProps {
  title: string;
  datetime: string;
  error_message?: string;
  status: 'success' | 'failed' | 'running' | 'pending';
}
export const SubTask: React.FC<SubTaskProps> = ({
  title,
  datetime,
  error_message,
  status,
}) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'success':
        return <SuccessIcon />;
      case 'failed':
        return <FailedIcon></FailedIcon>;
      case 'running':
        return <LoadingIcon />;
      default:
        return <LoadingIcon />;
    }
  };

  const getContainerStyle = () => {
    if (status === 'failed') {
      return 'bg-red-100';
    }
    return 'bg-zinc-100';
  };

  const getTextStyle = () => {
    if (status === 'failed') {
      return 'text-red-700 opacity-60';
    }
    return 'text-gray-800';
  };
  const description = status === 'failed' ? error_message : status;

  return (
    <div className="w-full rounded-lg flex items-center gap-2">
      <div className="flex-shrink-0">{getStatusIcon()}</div>
      <div
        className={`flex-1 min-w-0 h-[50px] px-3 py-2 ${getContainerStyle()} rounded-lg flex flex-col justify-start items-center gap-1`}
      >
        <div className="w-full flex items-center gap-2">
          <div
            className={`flex-1 ${getTextStyle()} text-xs font-medium font-['PingFang SC'] leading-tight`}
          >
            {title}
          </div>
          <div
            className={`opacity-60 text-right ${getTextStyle()} text-xs font-medium font-['PingFang SC'] leading-tight`}
          >
            {new Date(datetime).toLocaleString()}
          </div>
        </div>
        <div
          className={`w-full ${getTextStyle()} text-xs font-normal font-['PingFang SC'] leading-tight truncate`}
          title={description}
        >
          {description}
        </div>
      </div>
    </div>
  );
};

interface TaskListProps {
  tasks: RAGTask[];
  onClose?: () => void;
  title?: string;
}

export const TaskList: React.FC<TaskListProps> = ({ tasks }) => {
  return (
    <div className="bg-white flex flex-col gap-1">
      {tasks.length === 0 ? (
        <div className="h-[100px] flex items-center justify-center text-gray-500">
          {I18N.components.TaskList.meiYouChaXunDao}
        </div>
      ) : (
        tasks.map((task) => (
          <SubTask
            key={task.task_id}
            title={`${task.task_id}`}
            datetime={task.created_at}
            error_message={task.error_message}
            status={task.status}
          />
        ))
      )}
    </div>
  );
};
