'use client';
import React from 'react';
import HomeIcon from '@/public/icons/HomeIcon';
import {
  AreaChart,
  LineChart,
  Heatmap,
  BoxChart,
  RankChart,
} from '@petercatai/assistant';
import { useSearchParams } from 'next/navigation';
import { Spinner } from '@nextui-org/react';
import {
  useIssueStatistics,
  useIssueResolutionDuration,
  usePrStatistics,
  useCodeFrequency,
  useActivityStatistics,
  useActivityDatesAndTimes,
  useContributorStatistics,
} from '../hooks/useInsight';

export default function Insight() {
  const searchParams = useSearchParams();
  const repoName = searchParams.get('repo') || '';
  const botName = searchParams.get('name') || '';
  const { data: issueStatistic } = useIssueStatistics(repoName);
  const { data: issueResolutionDuration } =
    useIssueResolutionDuration(repoName);
  const { data: prStatistic } = usePrStatistics(repoName);
  const { data: codeFrequency } = useCodeFrequency(repoName);
  const { data: activityStatistics } = useActivityStatistics(repoName);
  const { data: activityDatesAndTimes } = useActivityDatesAndTimes(repoName);
  const { data: contributors } = useContributorStatistics(repoName);

  const Loading = (
    <div className="flex items-center justify-center h-[100%] w-[100%]">
      <Spinner size="lg" />
    </div>
  );
  return (
    <div className="flex w-full h-full flex-col bg-[#F3F4F6] min-h-screen">
      <div className="relative flex h-[72px] w-full items-center justify-between gap-2  px-6 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span
            className="flex items-center gap-2 cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              window.history.back();
            }}
          >
            <HomeIcon />
            <span className="text-gray-400">{botName}</span>
          </span>
          <span className="text-gray-400">/</span>
          <span>Insight</span>
        </div>
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          Powered by
          <a
            className="text-gray-500"
            href="https://open-digger.cn/docs/user_docs/intro"
          >
            HyperCRX
          </a>
        </div>
      </div>
      <div className="pb-[42px] px-[40px] overflow-y-auto">
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-white rounded h-[607px] p-[24px]">
            {contributors ? (
              <AreaChart
                data={contributors}
                height={500}
                title="Contributors"
              />
            ) : (
              Loading
            )}
          </div>
          <div className="bg-white rounded h-[607px] p-[24px]">
            {codeFrequency ? (
              <AreaChart
                data={codeFrequency}
                height={500}
                title="Code Frequency"
              />
            ) : (
              Loading
            )}
          </div>
          <div className="bg-white rounded h-[579px] p-[24px]">
            {prStatistic ? (
              <LineChart data={prStatistic} height={450} title="PR History" />
            ) : (
              Loading
            )}
          </div>
          <div className="bg-white rounded h-[579px] p-[24px]">
            {issueStatistic ? (
              <LineChart
                data={issueStatistic}
                height={450}
                colors={['#14B8A6', '#D946EF', '#F59E0B']}
                title="Issue History"
              />
            ) : (
              Loading
            )}
          </div>
          <div className="bg-white rounded h-[400px] p-[24px]">
            {issueResolutionDuration ? (
              <BoxChart
                data={issueResolutionDuration}
                height={300}
                title="Average Time To Issue Close"
              />
            ) : (
              Loading
            )}
          </div>
          <div className="bg-white rounded h-[400px] p-[24px]">
            {activityDatesAndTimes ? (
              <Heatmap
                data={activityDatesAndTimes}
                height={300}
                title="Repository Activity"
              />
            ) : (
              Loading
            )}
          </div>

          <div className="bg-white rounded h-[500px] col-span-2 p-[24px]">
            {activityStatistics ? (
              <RankChart
                data={activityStatistics}
                height={408}
                title="Contributor Rankings Top 10"
              />
            ) : (
              Loading
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
