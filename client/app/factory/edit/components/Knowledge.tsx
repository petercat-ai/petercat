'use client';
import I18N from '@/app/utils/I18N';
import React from 'react';
import { useBot } from '@/app/contexts/BotContext';
import 'react-toastify/dist/ReactToastify.css';
import HomeIcon from '@/public/icons/HomeIcon';
import { useBotRAGChunkList } from '@/app/hooks/useBot';
import { RAGDoc } from '@/app/services/BotsController';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from '@nextui-org/react';
import KnowledgeBtn from './KnowledgeBtn';
import { Pagination } from '@nextui-org/react';
import MySpinner from '@/components/Spinner';
import { convertToLocalTime } from '@/app/utils/time';
import { useBotTask } from './TaskContext';

type IProps = {
  botId: string;
  goBack: () => void;
};
const ChunkCard = ({ update_timestamp, content, file_path }: RAGDoc) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <>
      <div
        className="rounded-[8px] w-full h-[240px] p-[8px] bg-white flex flex-col gap-[8px] cursor-pointer"
        onClick={onOpen}
      >
        <div className="rounded-[4px] h-[154px] w-full p-2 bg-[#F3F4F6] mb-3 overflow-hidden overflow-ellipsis">
          <p className="line-clamp-4">{content}</p>
        </div>
        <div className="flex justify-between items-center gap-1">
          <h2 className="truncate overflow-hidden whitespace-nowrap font-bold text-lg">
            {file_path}
          </h2>
          <span className="bg-[#E5E7EB] text-[12px] rounded-[4px] p-[4px] color-[#4B5563] shrink-0">
            {content?.length} {I18N.components.Knowledge.ziFu}
          </span>
        </div>
        <p className="text-sm text-gray-600">
          {I18N.components.Knowledge.gengXinYu}
          {convertToLocalTime(update_timestamp ?? '')}
        </p>
      </div>
      <Modal
        size={'xl'}
        scrollBehavior={'inside'}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {file_path}
              </ModalHeader>
              <ModalBody>{content}</ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

const ChunkList = ({ data }: { data: RAGDoc[] }) => {
  return (
    <div className="grid grid-flow-row-dense gap-4 justify-items-center px-[40px] grid-cols-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3">
      {data.map((card, index) => (
        <ChunkCard key={card.id} {...card} />
      ))}
    </div>
  );
};

export default function Knowledge({ botId, goBack }: IProps) {
  const { botProfile } = useBot();
  const [pageSize, setPageSize] = React.useState(12);
  const [pageNumber, setPageNumber] = React.useState(1);
  const { taskProfile } = useBotTask();
  const {
    data: RagDocData,
    isPending,
    isLoading: isListLoading,
  } = useBotRAGChunkList(
    botId,
    pageSize,
    pageNumber,
    true,
    taskProfile.running,
  );
  const list = React.useMemo(() => {
    return RagDocData?.rows ?? [];
  }, [RagDocData]);
  return (
    <div className="flex w-full h-full flex-col bg-[#F3F4F6]">
      <div className="relative flex h-[72px] w-full items-center justify-between gap-2 border-[0.5px] border-gray-200 px-6 flex-shrink-0 bg-white">
        <div className="flex items-center gap-2">
          <span
            className="flex items-center gap-2 cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              goBack();
            }}
          >
            <HomeIcon />
            <span>{botProfile.name}</span>
          </span>
          <span>/</span>
          <span>{I18N.components.Knowledge.zhiShiKuFenDuan}</span>
        </div>
        <div className="flex items-center gap-2">
          <KnowledgeBtn botId={botId} onClick={() => {}} mode={'pageHeader'} />
        </div>
      </div>
      <div className="pt-[40px] py-[40px] overflow-y-auto">
        <MySpinner loading={isPending || isListLoading}>
          {list.length > 0 || isPending ? (
            <ChunkList data={list}></ChunkList>
          ) : (
            <div className="flex justify-center items-center h-full">
              {taskProfile.running ? (
                <h3>{I18N.components.Knowledge.zhiShiKuGengXin}</h3>
              ) : (
                <h3>{I18N.components.Knowledge.zhiShiKuWeiKong}</h3>
              )}
            </div>
          )}
        </MySpinner>
        {RagDocData?.total && RagDocData?.total > 12 && (
          <Pagination
            className="flex justify-center items-center mt-[60px] p-[0] w-full"
            total={Math.ceil((RagDocData?.total ?? 0) / 12)}
            initialPage={1}
            page={pageNumber}
            size="lg"
            onChange={(page) => setPageNumber(page)}
          />
        )}
      </div>
    </div>
  );
}
