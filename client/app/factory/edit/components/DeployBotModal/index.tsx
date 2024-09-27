'use client';
import I18N from '@/app/utils/I18N';
import React, { useEffect, useMemo, useState } from 'react';
import lodash from 'lodash';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Spinner,
} from '@nextui-org/react';
import {
  useBindBotToRepo,
  usePublicBot,
  useGetBotApprovalList,
  useGetUserPeterCatAppRepos,
  useTakedownBot,
  useDeployWebsite,
} from '@/app/hooks/useBot';
import { useBot } from '@/app/contexts/BotContext';
import SaveSuccessIcon from '@/public/icons/SaveSuccessIcon';
import { DeployState } from './types';
import { DeployContent } from './DeployContent';
import { diffRepoBindResult } from './utils';
import DeploySuccessIcon from '@/public/icons/DeploySuccessIcon';

interface IModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MyBotDeployModal: React.FC<IModalProps> = ({ isOpen, onClose }) => {
  const [deployInfo, setDeployInfo] = useState<DeployState>({});
  const { botProfile } = useBot();
  const {
    bindBotToRepo,
    isLoading: isBindBotLoading,
    isSuccess: isBindBotSuccess,
  } = useBindBotToRepo();
  const {
    publicBot,
    isLoading: isPublicBotLoading,
    isSuccess: isPublicBotSuccess,
  } = usePublicBot();
  const {
    takedownBot,
    isLoading: isTakeDownBotLoading,
    isSuccess: isTakedownBotSuccess,
  } = useTakedownBot();
  const {
    deployWebsite,
    isLoading: isDeployWebsiteLoading,
    isSuccess: isDeployWebsiteSuccess,
  } = useDeployWebsite();

  const { data: botApprovalList = [], isLoading: isGetBotApprovalLoading } =
    useGetBotApprovalList(botProfile.id, 'open', isOpen);
  const { data: peterCatBotRepos = [], isLoading: isGetUserReposLoading } =
    useGetUserPeterCatAppRepos(isOpen);
  const marketApproval =
    (botApprovalList ?? []).find((item: any) => item.task_type === 'market') ??
    {};
  const websiteApproval =
    (botApprovalList ?? []).find((item: any) => item.task_type === 'website') ??
    {};

  const originDeployModel = useMemo<DeployState>(() => {
    return {
      publicMarket: { checked: botProfile.public ?? false },
      deployWebsite: {
        checked: !!botProfile.domain_whitelist[0],
        targetUrl: botProfile.domain_whitelist[0],
      },
      appInstalledRepo: peterCatBotRepos.map((item: any) => ({
        repo_id: item.repo_id,
        checked: item.robot_id === botProfile.id,
      })),
    };
  }, [botProfile, botApprovalList, peterCatBotRepos]);

  useEffect(() => {
    setDeployInfo(lodash.cloneDeep(originDeployModel));
  }, [originDeployModel]);

  const [deployBtnDisabled, setDeployBtnDisabled] = useState(true);
  useEffect(() => {
    if (lodash.isEqual(originDeployModel, deployInfo)) {
      setDeployBtnDisabled(true);
    } else {
      setDeployBtnDisabled(false);
    }
  }, [deployInfo, originDeployModel]);

  const handleDeployChange = (value: DeployState) => {
    setDeployInfo(value);
  };

  const handleOK = () => {
    if (
      deployInfo.publicMarket?.checked &&
      !originDeployModel.publicMarket?.checked
    ) {
      publicBot(botProfile.id);
    } else if (
      !deployInfo.publicMarket?.checked &&
      originDeployModel.publicMarket?.checked
    ) {
      takedownBot(botProfile.id);
    }
    if (
      deployInfo.deployWebsite?.checked &&
      !originDeployModel.deployWebsite?.checked
    ) {
      deployWebsite({
        bot_id: botProfile.id,
        website_url: deployInfo.deployWebsite?.targetUrl,
      });
    } else if (
      !deployInfo.deployWebsite?.checked &&
      originDeployModel.deployWebsite?.checked
    ) {
      deployWebsite({
        bot_id: botProfile.id,
        website_url: undefined,
      });
    }
    const bindRepoList = diffRepoBindResult(
      originDeployModel.appInstalledRepo ?? [],
      deployInfo.appInstalledRepo ?? [],
      botProfile.id,
    );
    bindRepoList.length > 0 && bindBotToRepo(bindRepoList);
  };
  const isDeploySuccess =
    isPublicBotSuccess ||
    isTakedownBotSuccess ||
    isDeployWebsiteSuccess ||
    isBindBotSuccess;
  return (
    <>
      <Modal
        isDismissable={false}
        isOpen={isOpen}
        onClose={onClose}
        hideCloseButton={true}
      >
        <ModalContent>
          {(onClose) => (
            <>
              {isDeploySuccess ? (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    <div className="flex justify-center items-center gap-2 h-[40px]">
                      <span className="mt-[28px]">
                        <DeploySuccessIcon />
                      </span>
                      <span>部署成功</span>
                    </div>
                  </ModalHeader>
                  <ModalFooter className="flex justify-center items-center">
                    <Button
                      className="border-[1.5px] border-[#3F3F46] rounded-[46px] bg-[#3F3F46] text-white"
                      onPress={() => onClose()}
                    >
                      确认
                    </Button>
                  </ModalFooter>
                </>
              ) : (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    <div className="flex justify-center items-center gap-2 h-[40px]">
                      <span className="mt-[28px]">
                        <SaveSuccessIcon />
                      </span>
                      <span>保存成功！</span>
                    </div>
                  </ModalHeader>
                  <ModalBody className="py-[0px]">
                    {isGetUserReposLoading || isGetBotApprovalLoading ? (
                      <Spinner></Spinner>
                    ) : (
                      <DeployContent
                        deployInfo={deployInfo}
                        websiteApproval={websiteApproval}
                        marketApproval={marketApproval}
                        peterCatBotRepos={peterCatBotRepos}
                        onChange={handleDeployChange}
                      />
                    )}
                  </ModalBody>
                  <ModalFooter className="flex justify-center items-center">
                    <Button
                      className="border-[1.5px] border-[#3F3F46] rounded-[46px]"
                      variant="light"
                      onPress={() => onClose()}
                    >
                      跳过
                    </Button>
                    <Button
                      isDisabled={deployBtnDisabled}
                      isLoading={
                        isPublicBotLoading ||
                        isTakeDownBotLoading ||
                        isDeployWebsiteLoading ||
                        isBindBotLoading
                      }
                      className="border-[1.5px] border-[#3F3F46] rounded-[46px] bg-[#3F3F46] text-white"
                      onPress={() => handleOK()}
                    >
                      确认
                    </Button>
                  </ModalFooter>
                </>
              )}
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

const DeployBotModal = (props: IModalProps) => {
  const { isOpen } = props;
  return <>{isOpen && <MyBotDeployModal {...props} />}</>;
};
export default DeployBotModal;
