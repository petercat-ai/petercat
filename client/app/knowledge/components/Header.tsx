import I18N from '@/app/utils/I18N';

import { useEffect } from 'react';
import { useReloadRepo } from '@/app/hooks/useRAG';
import RefreshIcon from '@/public/icons/RefreshIcon';
import { Button, Tooltip } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import TaskButton from './TaskButton';
import { toast } from 'react-toastify';
import LoadingIcon from '@/public/icons/LoadingIcon';

export default function KnowledgePageHeader(props: {
  repo_name: string;
  bot_id: string;
}) {
  const { repo_name, bot_id } = props;
  const router = useRouter();
  const { data, reloadRepo, error, isLoading, isSuccess } = useReloadRepo();

  useEffect(() => {
    if (isSuccess) {
      toast.success(I18N.components.Header.chengGongGengXinDai);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (error) {
      toast.error(
        I18N.template?.(I18N.components.Header.gengXinDaiMaCang2, {
          val1: error.message,
        }),
      );
    }
  }, [error]);

  return (
    <div className="w-full  h-[72px] self-stretch pl-4 pr-5 py-4 bg-white border-b border-gray-200 justify-between items-center inline-flex">
      <div className="justify-start items-center gap-2 inline-flex">
        <div
          data-svg-wrapper
          onClick={() => router.push(`/factory/edit?id=${bot_id}`)}
          className="cursor-pointer"
        >
          <Tooltip
            content={I18N.components.Header.bianJiJiQiRen}
            placement="bottom"
          >
            <svg width="24" height="32" viewBox="0 0 24 32" fill="none">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M11.1519 6.7515C11.6205 6.28287 12.3803 6.28287 12.849 6.7515L21.249 15.1515C21.5922 15.4947 21.6948 16.0108 21.5091 16.4592C21.3233 16.9077 20.8858 17.2 20.4004 17.2H19.2004V24.4C19.2004 25.0628 18.6632 25.6 18.0004 25.6H15.6004C14.9377 25.6 14.4004 25.0628 14.4004 24.4V20.8C14.4004 20.1373 13.8632 19.6 13.2004 19.6H10.8004C10.1377 19.6 9.60043 20.1373 9.60043 20.8V24.4C9.60043 25.0628 9.06317 25.6 8.40043 25.6H6.00043C5.33768 25.6 4.80043 25.0628 4.80043 24.4V17.2H3.60043C3.11507 17.2 2.67751 16.9077 2.49177 16.4592C2.30603 16.0108 2.4087 15.4947 2.7519 15.1515L11.1519 6.7515Z"
                fill="#6B7280"
              />
            </svg>
          </Tooltip>
        </div>
        <div className="flex-col justify-start items-start inline-flex">
          <div className="justify-start items-center gap-1 inline-flex">
            <div>
              <span className="text-gray-400 text-base font-medium font-['PingFang SC'] leading-loose">
                {repo_name}
              </span>
              <span className="text-gray-400 mx-[4px] text-base font-medium font-['PingFang SC'] leading-loose">
                /
              </span>
              <span className="text-gray-800 text-base font-medium font-['PingFang SC'] leading-loose">
                {I18N.components.Header.zhiShiLieBiao}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="self-stretch justify-end items-center gap-4 inline-flex">
        <TaskButton space_id={repo_name}></TaskButton>
        <Button
          onPress={() => reloadRepo(repo_name)}
          className="bg-[#3F3F46] text-[#FFFFFF] rounded-full px-4 py-2"
          isLoading={isLoading}
          startContent={isLoading ? <></> : <RefreshIcon />}
        >
          {I18N.components.Header.gengXinDaiMaCang}
        </Button>
      </div>
    </div>
  );
}
