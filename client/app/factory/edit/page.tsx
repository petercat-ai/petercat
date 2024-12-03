'use client';
import I18N from '@/app/utils/I18N';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Tabs,
  Tab,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Avatar,
  Checkbox,
} from '@nextui-org/react';
import Image from 'next/image';
import BotCreateFrom from '@/app/factory/edit/components/BotCreateForm';
import { toast, ToastContainer } from 'react-toastify';
import BackIcon from '@/public/icons/BackIcon';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useRouter } from 'next/navigation';
import {
  useBotConfigGenerator,
  useBotConfig,
  useBotCreate,
  useBotEdit,
} from '@/app/hooks/useBot';
import { useAgreement, useAgreementStatus } from '@/app/hooks/useAgreement';
import FullPageSkeleton from '@/components/FullPageSkeleton';
import { isEmpty } from 'lodash';
import { Chat } from '@petercatai/assistant';
import AIBtnIcon from '@/public/icons/AIBtnIcon';
import ChatIcon from '@/public/icons/ChatIcon';
import ConfigIcon from '@/public/icons/ConfigIcon';
import SaveIcon from '@/public/icons/SaveIcon';
import { useBot } from '@/app/contexts/BotContext';
import useUser from '@/app/hooks/useUser';
import Knowledge from './components/Knowledge';
import { useGlobal } from '@/app/contexts/GlobalContext';
import KnowledgeBtn from './components/KnowledgeBtn';
import { BotTaskProvider } from './components/TaskContext';
import { useSearchParams } from 'next/navigation';
import 'react-toastify/dist/ReactToastify.css';
import { extractFullRepoNameFromGitHubUrl } from '@/app/utils/tools';
import DeployBotModal from './components/DeployBotModal';
import Markdown from '@/components/Markdown';
import AgreementZhCN from '../../../.kiwi/zh-CN/agreement.md';
import AgreementEN from '../../../.kiwi/en/agreement.md';
import AgreementJA from '../../../.kiwi/ja/agreement.md';
import AgreementKO from '../../../.kiwi/ko/agreement.md';
import AgreementZhTW from '../../../.kiwi/zh-TW/agreement.md';

const API_HOST = process.env.NEXT_PUBLIC_API_DOMAIN;
enum VisibleTypeEnum {
  BOT_CONFIG = 'BOT_CONFIG',
  KNOWLEDGE_DETAIL = 'KNOWLEDGE_DETAIL',
}
enum ConfigTypeEnum {
  CHAT_CONFIG = 'CHAT_CONFIG',
  MANUAL_CONFIG = 'MANUAL_CONFIG',
}
export default function Edit() {
  const { language } = useGlobal();
  const { botProfile, setBotProfile } = useBot();
  const { user, status } = useUser();
  const {
    data: agreementStatus,
    isLoading: getAgreementStatusLoading,
    error: getAgreementStatusError,
  } = useAgreementStatus();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [activeTab, setActiveTab] = React.useState<ConfigTypeEnum>(
    ConfigTypeEnum.CHAT_CONFIG,
  );
  const [visibleType, setVisibleType] = React.useState<VisibleTypeEnum>(
    VisibleTypeEnum.BOT_CONFIG,
  );
  const [gitUrl, setGitUrl] = React.useState<string>('');
  const [deployModalIsOpen, setDeployModalIsOpen] = useState(false);
  const [agreementModalIsOpen, setAgreementModalIsOpen] = useState(false);
  const [agreementAccepted, setAgreementAccepted] =
    React.useState<boolean>(true);
  const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN;

  const markdownContent = useMemo(() => {
    switch (language) {
      case 'zh-CN':
        return AgreementZhCN;
      case 'zh-TW':
        return AgreementZhTW;
      case 'ja':
        return AgreementJA;
      case 'ko':
        return AgreementKO;
      case 'en':
        return AgreementEN;
      default:
        return AgreementEN;
    }
  }, [language]);

  useEffect(() => {
    if (status === 'pending') {
      return;
    }
    if (!user || user.id.startsWith('client|')) {
      router.push(`${apiDomain}/api/auth/login`);
    }
  }, [user, status]);

  useEffect(() => {
    if (getAgreementStatusLoading) {
      return;
    }
    if (getAgreementStatusError) {
      setAgreementModalIsOpen(true);
    } else {
      const agreementAccepted = agreementStatus?.data?.agreement_accepted;
      setAgreementModalIsOpen(!agreementAccepted);
    }
  }, [agreementStatus, getAgreementStatusError, getAgreementStatusLoading]);

  const {
    updateBot: onUpdateBot,
    isLoading: updateBotLoading,
    isSuccess: editSuccess,
    error: editError,
  } = useBotEdit();

  const {
    data: createResponseData,
    createBot: onCreateBot,
    isLoading: createBotLoading,
    isSuccess: createSuccess,
    error: createError,
  } = useBotCreate();

  const {
    acceptAgreement: onAcceptAgreement,
    isLoading: acceptAgreementLoading,
    isSuccess: acceptAgreementSuccess,
    error: acceptAgreementError,
  } = useAgreement();

  const {
    data: generatorResponseData,
    getBotInfoByRepoName,
    isLoading: getBotInfoByRepoNameLoading,
    isSuccess: getBotInfoByRepoNameSuccess,
    error: getBotInfoByRepoNameError,
  } = useBotConfigGenerator();

  const updateConfigFromChatResult = useCallback((response: string) => {
    try {
      const data = JSON.parse(response)?.data?.[0];
      if (!isEmpty(data)) {
        setBotProfile((draft) => {
          draft.id = data.id;
          draft.name = data.name;
          draft.avatar = data.avatar;
          draft.gitAvatar = data.avatar;
          draft.prompt = data.prompt;
          draft.description = data.description;
          draft.starters = data.starters;
          draft.public = data.public;
          draft.repoName = data.repo_name;
          draft.helloMessage = data.hello_message;
        });
      }
    } catch (e) {
      console.error(JSON.stringify(e));
    }
  }, []);

  const isEdit = useMemo(
    () => (!!id && id !== 'new') || !!botProfile?.id,
    [id, botProfile?.id],
  );

  const botId = useMemo(() => {
    if (!!id && id !== 'new') {
      return id;
    } else if (!!botProfile?.id) {
      return botProfile.id;
    } else {
      return undefined;
    }
  }, [id, botProfile?.id]);

  const { data: config, isLoading } = useBotConfig(
    `${id}`,
    !!id && id !== 'new',
  );

  useEffect(() => {
    if (!isEmpty(config)) {
      setBotProfile((draft) => {
        draft.id = config.id;
        draft.name = config.name || '';
        draft.description = config.description || '';
        draft.avatar = config.avatar || '';
        draft.starters = config.starters || [''];
        draft.helloMessage = config.hello_message || '';
        draft.prompt = config.prompt || '';
        draft.public = config.public ?? false;
        draft.repoName = config.repo_name ?? '';
        draft.domain_whitelist = config.domain_whitelist ?? [];
      });
    }
  }, [config]);

  useEffect(() => {
    if (!isEmpty(generatorResponseData))
      setBotProfile((draft) => {
        draft.name = generatorResponseData.name || '';
        draft.description = generatorResponseData.description || '';
        draft.avatar = generatorResponseData.avatar || '';
        draft.starters = generatorResponseData.starters || [''];
        draft.prompt = generatorResponseData.prompt || '';
        draft.public = generatorResponseData.public ?? false;
        draft.helloMessage = generatorResponseData.hello_message || '';
      });
  }, [generatorResponseData]);

  useEffect(() => {
    if (acceptAgreementSuccess) {
      toast.error('An error has occurred');
      setAgreementModalIsOpen(true);
    }
  }, [acceptAgreementError]);

  useEffect(() => {
    if (acceptAgreementSuccess) {
      setAgreementModalIsOpen(false);
    }
  }, [acceptAgreementSuccess]);

  useEffect(() => {
    if (createSuccess) {
      setDeployModalIsOpen(true);
    }
  }, [createSuccess]);

  useEffect(() => {
    if (createError) {
      toast.error(I18N.edit.page.shengChengShiBaiC);
    }
  }, [createError]);

  useEffect(() => {
    if (editSuccess) {
      setDeployModalIsOpen(true);
    }
  }, [editSuccess]);

  useEffect(() => {
    if (editError) {
      toast.error(I18N.edit.page.baoCunShiBaiE);
    }
  }, [editError]);

  useEffect(() => {
    if (editError) {
      toast.error(I18N.edit.page.shengChengChengGongE);
    }
  }, [getBotInfoByRepoNameSuccess]);

  useEffect(() => {
    if (editSuccess) {
      toast.success(I18N.edit.page.shengChengShiBai);
    }
  }, [getBotInfoByRepoNameError]);

  useEffect(() => {
    const botInfo = createResponseData?.[0];
    if (!isEmpty(botInfo)) {
      setBotProfile((draft) => {
        draft.repoName = botInfo.repo_name;
        draft.id = botInfo.id;
        draft.name = botInfo.name;
        draft.avatar = botInfo.avatar;
        draft.gitAvatar = botInfo.avatar;
        draft.prompt = botInfo.prompt;
        draft.description = botInfo.description;
        draft.starters = botInfo.starters;
        draft.public = botInfo.public;
        draft.helloMessage = botInfo.hello_message;
      });
    }
  }, [createResponseData]);

  if (isLoading || getBotInfoByRepoNameLoading) {
    return <FullPageSkeleton />;
  }

  const chatConfigContent = (
    <div style={{ height: 'calc(100vh - 73px)' }}>
      {typeof window !== 'undefined' && (
        <Chat
          assistantMeta={{
            avatar:
              'https://mdn.alipayobjects.com/huamei_j8gzmo/afts/img/A*YAP3SI7MMHQAAAAAAAAAAAAADrPSAQ/original',
            title: 'PeterCat',
          }}
          style={{
            backgroundColor: '#fff',
          }}
          hideLogo={true}
          // @ts-ignore
          editBotId={botId!}
          apiUrl="/api/chat/stream_builder"
          apiDomain={API_HOST}
          helloMessage={I18N.edit.page.chuCiJianMianXian}
          starters={[I18N.edit.page.bangWoPeiZhiYi]}
          getToolsResult={(result) => {
            const data = result?.data;
            updateConfigFromChatResult(data);
          }}
        />
      )}
    </div>
  );
  const manualConfigLabel = (
    <div className="flex justify-between">
      <span>{I18N.edit.page.gITHU}</span>
      {botProfile.id && (
        <CopyToClipboard
          text={botProfile.id}
          onCopy={() => {
            toast.success(I18N.edit.page.tOKEN);
          }}
        >
          {/* @ts-ignore */}
          <span className="text-xs text-gray-500 cursor-pointer">
            {I18N.edit.page.fuZhiTOK}
          </span>
        </CopyToClipboard>
      )}
    </div>
  );

  const manualConfigContent = (
    <div className="h-full px-10 py-10 overflow-x-hidden overflow-y-scroll">
      <div className="px-[46px]">
        <Input
          type="text"
          variant="bordered"
          name="repo_name"
          label={manualConfigLabel}
          disabled={isEdit}
          placeholder={I18N.edit.page.qingShuRuGI}
          labelPlacement="outside"
          onChange={(e) => {
            const url = e.target.value;
            setGitUrl(url);
          }}
          value={gitUrl || botProfile.repoName}
          isDisabled={isEdit}
          required
          classNames={{ label: 'w-full' }}
          className="mt-1 mb-6 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
        <div className="flex items-center gap-4">
          {!isEdit ? (
            <div className="w-full text-center">
              <Button
                radius="full"
                className="bg-gray-700 text-white"
                startContent={<AIBtnIcon />}
                isLoading={createBotLoading}
                onClick={() => {
                  const repoName = extractFullRepoNameFromGitHubUrl(gitUrl);
                  if (repoName) {
                    onCreateBot({
                      repo_name: repoName!!,
                      lang: language,
                    });
                  } else {
                    toast.error(I18N.edit.page.diZhiYouWu);
                  }
                }}
              >
                {I18N.edit.page.ziDongShengChengPei}
              </Button>
            </div>
          ) : (
            <Button
              radius="full"
              className="bg-[#F1F1F1] text-gray-500"
              startContent={<AIBtnIcon />}
              isLoading={createBotLoading}
              onClick={() => {
                getBotInfoByRepoName({
                  repo_name: botProfile?.repoName!,
                  lang: language,
                });
              }}
            >
              {I18N.edit.page.chongXinShengChengPei}
            </Button>
          )}
          {isEdit &&
          activeTab === ConfigTypeEnum.MANUAL_CONFIG &&
          botProfile.repoName ? (
            <KnowledgeBtn
              repoName={botProfile.repoName}
              onClick={() => {
                setVisibleType(VisibleTypeEnum.KNOWLEDGE_DETAIL);
              }}
              mode={'configItem'}
            />
          ) : null}
        </div>
      </div>

      {isEdit && <BotCreateFrom />}
    </div>
  );

  const updateBot = async () => {
    const params = {
      ...botProfile,
      starters: botProfile?.starters?.filter((s) => s),
    };
    onUpdateBot(params);
  };

  return (
    <BotTaskProvider>
      <div className="flex h-full w-full flex-col items-center bg-white mb-[-40px] overflow-hidden">
        <>
          <ToastContainer />
          {visibleType === VisibleTypeEnum.BOT_CONFIG ? (
            <div className="relative flex w-full grow overflow-hidden">
              <div className="flex w-full justify-center md:w-1/2">
                <div className="h-full grow">
                  <div className="relative flex h-[72px] w-full items-center justify-between gap-2 border-[0.5px] border-gray-200 px-6 flex-shrink-0">
                    <div className="flex items-center gap-2">
                      <a
                        className="text-slate-500 hover:text-blue-600 flex items-center gap-2"
                        href="/factory/list"
                      >
                        <BackIcon />
                      </a>
                      <div className="flex items-center gap-2">
                        <Avatar
                          src={botProfile?.avatar}
                          className="mr-1 w-[32px] h-[32px] text-large bg-gray-50"
                          name={botProfile?.name!}
                        />
                        <span>{botProfile?.name!}</span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Tabs
                        defaultSelectedKey={ConfigTypeEnum.CHAT_CONFIG}
                        variant="light"
                        selectedKey={activeTab}
                        aria-label="Options"
                        onSelectionChange={(key) =>
                          setActiveTab(`${key}` as ConfigTypeEnum)
                        }
                        classNames={{
                          base: 'min-w-[230px] h-[36px]',
                          tab: 'shadow-none h-[36px] px-0 py-0',
                          tabContent:
                            'group-data-[selected=true]:bg-[#FAE4CB] rounded-full px-3 py-2  h-[36px]',
                          cursor: 'shadow-none rounded-full ',
                        }}
                      >
                        <Tab
                          key={ConfigTypeEnum.CHAT_CONFIG}
                          title={
                            <div className="flex items-center space-x-2 text-[#000] group-data-[selected=true]:text-[#000]">
                              <ChatIcon />
                              <span className="ml-2">
                                {I18N.edit.page.duiHuaTiaoShi}
                              </span>
                            </div>
                          }
                        />

                        <Tab
                          key={ConfigTypeEnum.MANUAL_CONFIG}
                          title={
                            <div className="flex items-center space-x-2 text-[#000] group-data-[selected=true]:text-[#000]">
                              <ConfigIcon />
                              <span className="ml-2">
                                {I18N.edit.page.shouDongPeiZhi}
                              </span>
                            </div>
                          }
                        />
                      </Tabs>
                    </div>
                  </div>
                  <div className="h-full grow overflow-y-auto overflow-x-hidden flex h-full flex-col">
                    <div
                      style={{
                        visibility:
                          activeTab === ConfigTypeEnum.CHAT_CONFIG
                            ? 'visible'
                            : 'hidden',
                      }}
                    >
                      {chatConfigContent}
                    </div>
                    <div
                      style={{
                        position: 'absolute',
                        width: '50%',
                        height: 'calc(100vh - 73px)',
                        visibility:
                          activeTab !== ConfigTypeEnum.CHAT_CONFIG
                            ? 'visible'
                            : 'hidden',
                      }}
                    >
                      {manualConfigContent}
                    </div>
                  </div>
                </div>
              </div>
              <div className="hidden w-1/2 justify-center bg-[#FCFCFC] border-[0.5px] border-gray-200 md:flex relative">
                <div className="relative flex h-[72px] w-full items-center justify-between gap-2 px-6 flex-shrink-0">
                  <div className="flex items-center gap-2"></div>
                  <div className="flex items-center">
                    <div>{I18N.edit.page.yuLanYuCeShi}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      className="rounded-full bg-gray-700 text-white"
                      size="sm"
                      isLoading={createBotLoading || updateBotLoading}
                      variant="flat"
                      startContent={<SaveIcon />}
                      onClick={(e) => {
                        e.preventDefault();
                        if (botProfile?.id) {
                          updateBot();
                        }
                      }}
                    >
                      {I18N.edit.page.baoCunYuBuShu}
                    </Button>
                  </div>
                </div>
                <div className="position absolute top-[73px] left-0 w-full">
                  <div style={{ height: 'calc(100vh - 73px)' }}>
                    {typeof window !== 'undefined' && (
                      <Chat
                        hideLogo={true}
                        assistantMeta={{
                          avatar:
                            botProfile?.avatar ||
                            'https://mdn.alipayobjects.com/huamei_j8gzmo/afts/img/A*YAP3SI7MMHQAAAAAAAAAAAAADrPSAQ/original',
                          title: botProfile?.name || 'PeterCat',
                        }}
                        style={{
                          backgroundColor: '#FCFCFC',
                        }}
                        token={botId}
                        apiDomain={API_HOST}
                        apiUrl="/api/chat/stream_qa"
                        prompt={botProfile?.prompt}
                        starters={botProfile?.starters}
                        helloMessage={botProfile?.helloMessage}
                        disabledPlaceholder={I18N.edit.page.jiQiRenShangWei}
                        disabled={!isEdit}
                      />
                    )}
                  </div>
                </div>
              </div>
              <DeployBotModal
                isOpen={deployModalIsOpen}
                onClose={() => {
                  setDeployModalIsOpen(false);
                }}
              />
            </div>
          ) : (
            <></>
          )}
          {visibleType === VisibleTypeEnum.KNOWLEDGE_DETAIL ? (
            <Knowledge
              repoName={botProfile.repoName!}
              goBack={() => {
                setVisibleType(VisibleTypeEnum.BOT_CONFIG);
              }}
            ></Knowledge>
          ) : (
            <></>
          )}
        </>

        <Modal
          isDismissable={false}
          radius="sm"
          size="2xl"
          backdrop="blur"
          hideCloseButton={true}
          classNames={{
            body: 'py-0 z-[1001] ',
            base: 'h-[560px]',
            footer: 'flex justify-between',
          }}
          isOpen={agreementModalIsOpen}
          isKeyboardDismissDisabled={false}
        >
          <ModalContent>
            {() => (
              <>
                <ModalHeader className="flex items-center justify-center">
                  <div className="flex items-center space-x-4 p-4">
                    <Image
                      width={47}
                      height={30}
                      alt="icon"
                      src="/images/agreementIcon.svg"
                    />
                    <div className="text-default-gray-800 font-pingfang text-lg font-medium">
                      {I18N.app.page.agreement}
                    </div>
                  </div>
                </ModalHeader>
                <ModalBody>
                  <div
                    className="border border-gray-300 rounded-lg bg-white w-[608px] h-[398px] p-4 
                  overflow-x-hidden overflow-y-scroll"
                  >
                    <Markdown markdownContent={markdownContent} theme={false} />
                  </div>
                </ModalBody>
                <ModalFooter>
                  <div className="flex-1 space-x-2 py-2 contents">
                    <Checkbox
                      defaultChecked
                      defaultSelected
                      classNames={{
                        icon: 'bg-gray-700 text-white border-gray-700 w-[18px] h-[18px] rounded-sm p-1',
                        wrapper: 'w-[18px] h-[18px] rounded-sm',
                        label: 'text-gray-800',
                      }}
                      onChange={(e) => {
                        setAgreementAccepted(e.target.checked);
                      }}
                      radius="sm"
                      color="default"
                    >
                      {I18N.app.page.agreementLabel}
                    </Checkbox>
                  </div>
                  <div className="flex-1 text-right">
                    <div className="flex items-center justify-end px-4  space-x-2">
                      <Button
                        radius="full"
                        variant="bordered"
                        color="default"
                        className="border-gray-700 text-gray-700"
                        onPress={() => {
                          router.push('/factory/list');
                        }}
                      >
                        {I18N.components.BotCreateFrom.quXiao}
                      </Button>
                      <Button
                        isDisabled={!agreementAccepted}
                        radius="full"
                        isLoading={acceptAgreementLoading}
                        color="default"
                        onPress={() => {
                          onAcceptAgreement();
                        }}
                        className="bg-gray-700 text-white "
                      >
                        {I18N.components.BotCreateFrom.queRen}
                      </Button>
                    </div>
                  </div>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </BotTaskProvider>
  );
}
