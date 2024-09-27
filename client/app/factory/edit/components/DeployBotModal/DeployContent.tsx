import I18N from '@/app/utils/I18N';
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
        title={I18N.DeployBotModal.DeployContent.gongKaiDaoPE}
        onChange={(key, checked) => {
          onChange({ ...deployInfo, publicMarket: { checked } });
        }}
      >
        <span className="text-gray-500 text-[14px]">
          {isOpenApprovalStatus ? (
            <div className="flex flex-col">
              {I18N.DeployBotModal.DeployContent.shenHeZhong}{approval_path && (
                <a href={approval_path} target="_blank">
                  {approval_path}
                </a>
              )}
            </div>
          ) : (
            <>
              {isPublic ? (
                <span>{I18N.DeployBotModal.DeployContent.ninDeJiQiRen}</span>
              ) : (
                <span>
                  {I18N.DeployBotModal.DeployContent.zheJiangTiJiaoYi}</span>
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
        title={I18N.DeployBotModal.DeployContent.buShuDaoWoDe}
        subTitle={I18N.DeployBotModal.DeployContent.dianJiKaiShiPei}
        onChange={(key, checked) => {
          onChange({
            ...deployInfo,
            deployWebsite: { ...deployWebsite, checked },
          });
        }}
      >
        {approval_status === 'open' ? (
          <div className="text-gray-500 text-[14px] w-full flex flex-col">
            <span>{I18N.DeployBotModal.DeployContent.shenHeZhong}</span>
            <a href={approval_path} target="_blank">
              {approval_path}
            </a>
          </div>
        ) : (
          <Input
            type="url"
            label={
              <span className="font-sans text-[14px] font-semibold leading-[20px] text-left">
                {I18N.DeployBotModal.DeployContent.muBiaoWangZhanYu}</span>
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
            placeholder={I18N.DeployBotModal.DeployContent.qingShuRuYuMing}
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
        title={I18N.DeployBotModal.DeployContent.xuanZeYaoGuanLian}
        subTitle={I18N.DeployBotModal.DeployContent.dianJiKaiShiPei}
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
                            {I18N.DeployBotModal.DeployContent.zheJiangTiHuanCang}</span>
                        )}
                    </div>
                  </Checkbox>
                </div>
              ))}
            </CheckboxGroup>
          ) : (
            <div>
              <span>
                {I18N.DeployBotModal.DeployContent.weiNengHuoQuNin}<a
                  href="https://github.com/apps/petercat-assistant"
                  target="_blank"
                >
                  {I18N.DeployBotModal.DeployContent.qianWangAnZhuang}</a>
              </span>
              <span>{I18N.DeployBotModal.DeployContent.shuaXin}</span>
            </div>
          )}
        </div>
      </DeployItem>
    );
  };
  return (
    <>
      <span className="text-[14px] text-gray-800">{I18N.DeployBotModal.DeployContent.buShuDaoQiTa}</span>
      {renderPublicMarket()}
      {renderDeployMarket()}
      {renderBindRepo()}
    </>
  );
};
