import { Checkbox, CheckboxGroup, Input } from '@nextui-org/react';
import { DeployItem } from './DeployItem';
import { BotApproval, DeployState } from './types';
import { GithubRepoConfig } from '@/app/services/BotsController';
import { useBot } from '@/app/contexts/BotContext';

interface IDeployContentProps {
  deployInfo: DeployState;
  marketApproval: BotApproval;
  websiteApproval: BotApproval;
  peterCatBotRepos: GithubRepoConfig[];
  onChange: (deployInfo: DeployState) => void;
}

export const DeployContent: React.FC<IDeployContentProps> = ({
  deployInfo,
  marketApproval,
  websiteApproval,
  peterCatBotRepos,
  onChange,
}) => {
  const { botProfile } = useBot();
  const renderPublicMarket = () => {
    const isPublic = botProfile.public;
    const { publicMarket } = deployInfo;
    const { approval_path, approval_status } = marketApproval;
    const isOpenApprovalStatus = approval_status === 'open';
    return (
      <DeployItem
        disabled={isOpenApprovalStatus}
        canHide={false}
        defaultIsHide={false}
        checked={publicMarket?.checked ?? false}
        key={'market_issue'}
        title="公开到 Peter Cat 市场"
        onChange={(key, checked) => {
          onChange({ ...deployInfo, publicMarket: { checked } });
        }}
      >
        <span className="text-gray-500 text-[14px]">
          {isOpenApprovalStatus ? (
            <div className="flex flex-col">
              审核中...
              {approval_path && (
                <a href={approval_path} target="_blank">
                  {approval_path}
                </a>
              )}
            </div>
          ) : (
            <>
              {isPublic ? (
                <span>您的机器人已经公开到了市场，请前往市场查看。</span>
              ) : (
                <span>
                  这将提交一个 issue 到 Peter Cat
                  仓库，待我们人工审核通过后即可完成公开。
                </span>
              )}
            </>
          )}
        </span>
      </DeployItem>
    );
  };

  const renderDeployMarket = () => {
    const { deployWebsite } = deployInfo;
    const { approval_path, approval_status } = websiteApproval;
    return (
      <DeployItem
        canHide={true}
        disabled={approval_status === 'open'}
        checked={deployWebsite?.checked ?? !!approval_path}
        defaultIsHide={!approval_path}
        key={'website'}
        title="部署到我的网站"
        subTitle="点击开始配置"
        onChange={(key, checked) => {
          onChange({
            ...deployInfo,
            deployWebsite: { ...deployWebsite, checked },
          });
        }}
      >
        {approval_status === 'open' ? (
          <div className="text-gray-500 text-[14px] w-full flex flex-col">
            <span>审核中...</span>
            <a href={approval_path} target="_blank">
              {approval_path}
            </a>
          </div>
        ) : (
          <Input
            type="url"
            label={
              <span className="font-sans text-[14px] font-semibold leading-[20px] text-left">
                目标网站域名
              </span>
            }
            value={deployInfo?.deployWebsite?.targetUrl}
            onChange={(e) => {
              onChange({
                ...deployInfo,
                deployWebsite: {
                  checked: true,
                  ...deployInfo?.deployWebsite,
                  targetUrl: e.target.value,
                },
              });
            }}
            placeholder="请输入域名，一般以 https:// 开始"
            labelPlacement="outside"
          />
        )}
      </DeployItem>
    );
  };

  const renderBindRepo = () => {
    const { appInstalledRepo = [] } = deployInfo;
    const haveBindingRepo = appInstalledRepo.some((item) => item.checked);
    return (
      <DeployItem
        canHide={true}
        defaultIsHide={true}
        checked={haveBindingRepo}
        // 仅当有选项时允许勾选，将清除所有已经绑定的仓库，没有值时不允许勾选
        disabled={!haveBindingRepo}
        key={'github'}
        title="选择要关联的 GitHub 仓库"
        subTitle="点击开始配置"
        onChange={() => {
          // cancel any checked
          onChange({
            ...deployInfo,
            appInstalledRepo: deployInfo.appInstalledRepo?.map((item) => ({
              ...item,
              checked: false,
            })),
          });
        }}
      >
        <div className="w-full  max-h-[200px] overflow-scroll">
          {peterCatBotRepos?.length > 0 ? (
            <CheckboxGroup
              color="default"
              value={appInstalledRepo
                .filter((item) => item.checked)
                .map((item) => item.repo_id)}
              onChange={(selectedRepoIds: string[]) => {
                const tempInstalledRepo = appInstalledRepo.map((item) => {
                  let currentChecked = selectedRepoIds.includes(item.repo_id);
                  return {
                    ...item,
                    checked: currentChecked,
                  };
                });
                onChange({
                  ...deployInfo,
                  appInstalledRepo: appInstalledRepo.map((item) => {
                    let currentChecked = selectedRepoIds.includes(item.repo_id);
                    return {
                      ...item,
                      checked: currentChecked,
                    };
                  }),
                });
              }}
            >
              {peterCatBotRepos?.map((repo: GithubRepoConfig) => (
                <div className="w-full p-[8px] bg-[#F4F4F5] rounded-[8px]">
                  <Checkbox value={repo.repo_id!}>
                    <div
                      style={{ display: 'flex', flexDirection: 'column' }}
                      className="w-full gap-[4px] justify-between items-start px-[12px]"
                    >
                      <span>{repo.repo_name}</span>
                      {!!repo.robot_id &&
                        repo.robot_id !== botProfile.id &&
                        (deployInfo.appInstalledRepo ?? []).find(
                          (item) =>
                            item.checked && item.repo_id === repo.repo_id,
                        ) && (
                          <span className="text-[#EF4444] text-[12px]">
                            这将替换仓库原有机器人
                          </span>
                        )}
                    </div>
                  </Checkbox>
                </div>
              ))}
            </CheckboxGroup>
          ) : (
            <div>
              <span>
                未能获取您在 GITHUB 平台上已经安装 petercat assistant
                助手的仓库，请
                <a
                  href="https://github.com/apps/petercat-assistant"
                  target="_blank"
                >
                  前往安装
                </a>
              </span>
              <span>刷新</span>
            </div>
          )}
        </div>
      </DeployItem>
    );
  };
  return (
    <>
      <span className="text-[14px] text-gray-800">部署到其它平台</span>
      {renderPublicMarket()}
      {renderDeployMarket()}
      {renderBindRepo()}
    </>
  );
};
