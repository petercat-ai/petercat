import I18N from '@/app/utils/I18N';
import { useState } from 'react';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Pagination,
  useDisclosure,
} from '@nextui-org/react';
import {
  PageParams,
  RAGChunk,
  RAGKnowledge,
} from '@/app/services/RAGController';
import { useChunkList } from '@/app/hooks/useRAG';

const DeleteIcon = () => {
  return (
    <div data-svg-wrapper className="relative">
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
          d="M8.75 1C7.23122 1 6 2.23122 6 3.75V4.1927C5.20472 4.26972 4.41602 4.36947 3.63458 4.49129C3.22531 4.5551 2.94525 4.9386 3.00906 5.34787C3.07286 5.75714 3.45637 6.0372 3.86564 5.97339L4.01355 5.95062L4.85504 16.4693C4.96938 17.8985 6.16254 19 7.59629 19H12.4035C13.8372 19 15.0304 17.8985 15.1447 16.4693L15.9862 5.95055L16.1346 5.97339C16.5438 6.0372 16.9274 5.75714 16.9912 5.34787C17.055 4.9386 16.7749 4.5551 16.3656 4.49129C15.5841 4.36946 14.7954 4.2697 14 4.19268V3.75C14 2.23122 12.7688 1 11.25 1H8.75ZM10.0001 4C10.8395 4 11.673 4.02523 12.5 4.07499V3.75C12.5 3.05964 11.9404 2.5 11.25 2.5H8.75C8.05964 2.5 7.5 3.05964 7.5 3.75V4.075C8.32707 4.02524 9.16068 4 10.0001 4ZM8.57948 7.72002C8.56292 7.30614 8.21398 6.98404 7.8001 7.0006C7.38622 7.01716 7.06412 7.36609 7.08068 7.77998L7.38069 15.28C7.39725 15.6939 7.74619 16.016 8.16007 15.9994C8.57395 15.9828 8.89605 15.6339 8.87949 15.22L8.57948 7.72002ZM12.9195 7.77998C12.936 7.36609 12.614 7.01715 12.2001 7.0006C11.7862 6.98404 11.4372 7.30614 11.4207 7.72002L11.1207 15.22C11.1041 15.6339 11.4262 15.9828 11.8401 15.9994C12.254 16.016 12.6029 15.6939 12.6195 15.28L12.9195 7.77998Z"
          fill="#6B7280"
        />
      </svg>
    </div>
  );
};

const EditIcon = () => {
  return (
    <div data-svg-wrapper className="relative">
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5.43306 13.9168L6.69485 10.7623C6.89603 10.2593 7.19728 9.80249 7.58033 9.41945L14.4995 2.50071C15.3279 1.67229 16.6711 1.67229 17.4995 2.50072C18.3279 3.32914 18.3279 4.67229 17.4995 5.50072L10.5803 12.4194C10.1973 12.8025 9.74042 13.1037 9.23746 13.3049L6.08299 14.5667C5.67484 14.73 5.2698 14.3249 5.43306 13.9168Z"
          fill="#6B7280"
        />
        <path
          d="M3.5 5.75C3.5 5.05964 4.05964 4.5 4.75 4.5H10C10.4142 4.5 10.75 4.16421 10.75 3.75C10.75 3.33579 10.4142 3 10 3H4.75C3.23122 3 2 4.23122 2 5.75V15.25C2 16.7688 3.23122 18 4.75 18H14.25C15.7688 18 17 16.7688 17 15.25V10C17 9.58579 16.6642 9.25 16.25 9.25C15.8358 9.25 15.5 9.58579 15.5 10V15.25C15.5 15.9404 14.9404 16.5 14.25 16.5H4.75C4.05964 16.5 3.5 15.9404 3.5 15.25V5.75Z"
          fill="#6B7280"
        />
      </svg>
    </div>
  );
};

const ChunkCard = ({ chunk }: { chunk: RAGChunk }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <div className="w-[442px] h-60 px-2 pt-2 pb-4 bg-white rounded-lg flex-col justify-center items-start gap-3 inline-flex">
        <div
          className="relative p-1 w-[426px] h-[154px] overflow-hidden text-ellipsis bg-[#F1F1F1] cursor-pointer"
          title={chunk.context}
          onClick={onOpen}
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 6,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {chunk.context}
        </div>
        <div className="self-stretch h-[50px] px-2 flex-col justify-start items-start gap-2 flex">
          <div className="self-stretch justify-start items-center gap-4 inline-flex">
            <div className="grow shrink basis-0 h-[22px] justify-between items-center gap-3 flex">
              <div className="text-gray-800 text-sm font-medium font-['PingFang SC'] leading-snug">
                {chunk.chunk_id}
              </div>
              <div className="p-1 bg-gray-200 rounded-md justify-center items-center gap-2.5 flex">
                <div className="text-gray-600 text-xs font-normal font-['PingFang SC'] leading-3">
                  {chunk.context?.length} {I18N.components.Knowledge.ziFu}
                </div>
              </div>
            </div>
          </div>
          <div className="self-stretch h-5 text-gray-500 text-xs font-normal font-['PingFang SC'] leading-tight">
            {I18N.components.Knowledge.gengXinYu}
            {new Date(chunk.updated_at).toLocaleString()}
          </div>
        </div>
      </div>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="2xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <span className="text-gray-800 text-base font-medium font-['PingFang SC'] leading-normal">
                  分块内容
                </span>
              </ModalHeader>
              <ModalBody className="pb-4">
                <div className="w-full">{chunk.context}</div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
export default function ChunkList({ knowledge_id }: { knowledge_id: string }) {
  const [pageParams, setPageParams] = useState<PageParams<RAGChunk>>({
    page: 1,
    page_size: 10,
    order_direction: 'asc',
    eq_conditions: {
      knowledge_id: knowledge_id,
    },
  });
  const { data, isLoading, error, isFetching, refetch } =
    useChunkList(pageParams);
  return (
    <div className="w-full flex-1 px-4 py-6 flex flex-col min-h-[calc(100vh-200px)] overflow-y-auto">
      <div
        className="flex-grow justify-start items-start gap-4 flex flex-wrap"
        style={{ gap: '16px' }}
      >
        {(data?.items ?? []).map((item, index) => (
          <ChunkCard key={item.chunk_id} chunk={item}></ChunkCard>
        ))}
      </div>
      {/* 分页器区域 */}
      {data && (
        <div className="mt-auto pt-4">
          <Pagination
            total={data.total_pages}
            page={pageParams.page}
            onChange={(page) => {
              setPageParams((prevParams) => ({
                ...prevParams,
                page: page,
              }));
            }}
            className="flex justify-center"
            initialPage={1}
            size="lg"
            classNames={{
              cursor: 'bg-gray-700',
            }}
          />
        </div>
      )}
    </div>
  );
}
