'use client';
import React, { useEffect, useMemo } from 'react';
import { Tabs, Tab, Button, Input, Avatar } from '@nextui-org/react';
import BotCreateFrom from '@/app/factory/edit/components/BotCreateFrom';
import { toast, ToastContainer } from 'react-toastify';
import BackIcon from '@/public/icons/BackIcon';
import {
  useBotConfgGenerator,
  useBotConfig,
  useBotCreate,
  useBotEdit,
} from '@/app/hooks/useBot';
import PublicSwitcher from '@/app/factory/edit/components/PublicSwitcher';
import FullPageSkeleton from '@/components/FullPageSkeleton';
import { isEmpty } from 'lodash';
import { Chat } from 'petercat-lui';
import AIBtnIcon from '@/public/icons/AIBtnIcon';
import ChatIcon from '@/public/icons/ChatIcon';
import ConfigIcon from '@/public/icons/ConfigIcon';
import SaveIcon from '@/public/icons/SaveIcon';
import { useBot } from '@/app/contexts/BotContext';

import 'react-toastify/dist/ReactToastify.css';

const API_HOST = process.env.NEXT_PUBLIC_API_DOMAIN;

export default function Edit({ params }: { params: { id: string } }) {
  const { botProfile, setBotProfile } = useBot();

  const [activeTab, setActiveTab] = React.useState<string>('chatConfig');

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
    data: generatorResponseData,
    getBotInfoByReponame,
    isLoading: getBotInfoByReponameLoading,
    isSuccess: getBotInfoByReponameSuccess,
    error: getBotInfoByReponameError,
  } = useBotConfgGenerator();

  const isEdit = useMemo(
    () => (!!params?.id && params?.id !== 'new') || !!botProfile?.id,
    [params?.id, botProfile?.id],
  );

  const { data: config, isLoading } = useBotConfig(
    params?.id,
    !!params?.id && params?.id !== 'new',
  );

  useEffect(() => {
    if (!isEmpty(config))
      setBotProfile((draft) => {
        draft.id = config.id;
        draft.name = config.name || '';
        draft.description = config.description || '';
        draft.avatar = config.avatar || '';
        draft.starters = config.starters || [''];
        draft.helloMessage = config.hello_message || '';
        draft.prompt = config.prompt || '';
        draft.public = config.public ?? false;
      });
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

  const updateBot = async () => {
    const params = {
      ...botProfile,
      starters: botProfile?.starters?.filter((s) => s),
    };
    onUpdateBot(params);
  };

  useEffect(() => {
    if (createSuccess) {
      toast.success('生成成功');
    }
  }, [createSuccess]);

  useEffect(() => {
    if (createError) {
      toast.error(`生成失败${createError.message}`);
    }
  }, [createError]);

  useEffect(() => {
    if (editSuccess) {
      toast.success('保存成功');
    }
  }, [editSuccess]);

  useEffect(() => {
    if (editError) {
      toast.error(`保存失败${editError.message}`);
    }
  }, [editError]);

  useEffect(() => {
    if (editError) {
      toast.error(`生成成功${editError.message}`);
    }
  }, [getBotInfoByReponameSuccess]);

  useEffect(() => {
    if (editSuccess) {
      toast.success('生成失败');
    }
  }, [getBotInfoByReponameError]);

  useEffect(() => {
    const botInfo = createResponseData?.[0];
    if (!isEmpty(botInfo)) {
      setBotProfile((draft) => {
        draft.repoName = botProfile.repoName;
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

  if (isLoading || getBotInfoByReponameLoading) {
    return <FullPageSkeleton />;
  }

  const chatConfigContent = (
    <div style={{ height: 'calc(100vh - 73px)' }}>
      <Chat
        assistantMeta={{
          avatar:
            'https://mdn.alipayobjects.com/huamei_j8gzmo/afts/img/A*YAP3SI7MMHQAAAAAAAAAAAAADrPSAQ/original',
          title: 'PeterCat',
        }}
        apiUrl="/api/chat/stream_builder"
        apiDomain={API_HOST}
        helloMessage="👋🏻 你好，我是 Peter Cat， 初次见面，先自我介绍一下：我是一个开源项目的机器人。你可以通过和我对话配置一个答疑机器人。"
      />
    </div>
  );

  const manualConfigContent = (
    <div className="h-full px-10 py-10 overflow-x-hidden overflow-y-scroll">
      <div className="px-[46px]">
        <Input
          type="text"
          variant="bordered"
          name="repo_name"
          label="Github 项目名"
          value={botProfile?.repoName}
          placeholder="请输入 GitHub 项目名称 (ORG_NAME/REPO_NAME)"
          labelPlacement="outside"
          onChange={(e) => {
            const repoName = e.target.value;
            setBotProfile((draft) => {
              draft.repoName = repoName;
            });
          }}
          required
          className="mt-1 mb-6 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
        {!isEdit ? (
          <div className="w-full text-center">
            <Button
              radius="full"
              className="bg-gray-700 text-white"
              startContent={<AIBtnIcon />}
              isLoading={createBotLoading}
              onClick={() => {
                onCreateBot(botProfile?.repoName!);
              }}
            >
              自动生成配置
            </Button>
          </div>
        ) : (
          <Button
            radius="full"
            className="bg-[#F1F1F1] text-gray-500"
            startContent={<AIBtnIcon />}
            isLoading={createBotLoading}
            onClick={() => {
              getBotInfoByReponame(botProfile?.repoName!);
            }}
          >
            重新生成配置
          </Button>
        )}
      </div>

      {isEdit && <BotCreateFrom />}
    </div>
  );

  return (
    <div className="flex h-screen w-full flex-col items-center bg-white">
      <ToastContainer />
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
                  defaultSelectedKey="chatConfig"
                  variant="light"
                  selectedKey={activeTab}
                  aria-label="Options"
                  onSelectionChange={(key) => setActiveTab(`${key}`)}
                  classNames={{
                    base: 'w-[230px] h-[36px]',
                    tab: 'shadow-none w-[108px] h-[36px] px-0 py-0',
                    tabContent:
                      'group-data-[selected=true]:bg-[#FAE4CB] rounded-full px-3 py-2 w-[108px] h-[36px]',
                    cursor: 'shadow-none rounded-full w-[108px]',
                  }}
                >
                  <Tab
                    key="chatConfig"
                    title={
                      <div className="flex items-center space-x-2 text-[#000] group-data-[selected=true]:text-[#000]">
                        <ChatIcon /> <span className="ml-2">对话调试</span>
                      </div>
                    }
                  />

                  <Tab
                    key="manualConfig"
                    title={
                      <div className="flex items-center space-x-2 text-[#000] group-data-[selected=true]:text-[#000]">
                        <ConfigIcon />
                        <span className="ml-2">手动配置</span>
                      </div>
                    }
                  />
                </Tabs>
              </div>
              <div className="flex items-center gap-2">
                <PublicSwitcher
                  isSelected={!!botProfile?.public}
                  setBotProfile={setBotProfile}
                />
              </div>
            </div>
            <div className="h-full grow overflow-y-auto overflow-x-hidden flex h-full flex-col">
              {activeTab === 'chatConfig'
                ? chatConfigContent
                : manualConfigContent}
            </div>
          </div>
        </div>
        <div className="hidden w-1/2 justify-center bg-[#FCFCFC] border-[0.5px] border-gray-200 md:flex relative">
          <div className="relative flex h-[72px] w-full items-center justify-between gap-2 px-6 flex-shrink-0">
            <div className="flex items-center gap-2"></div>
            <div className="flex items-center">
              <div>预览与测试</div>
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
                保存
              </Button>
            </div>
          </div>
          <div className="position absolute top-[73px] left-0 w-full">
            <div style={{ height: 'calc(100vh - 73px)' }}>
              {isEdit && (
                <Chat
                  assistantMeta={{
                    avatar:
                      botProfile?.avatar ||
                      'https://mdn.alipayobjects.com/huamei_j8gzmo/afts/img/A*YAP3SI7MMHQAAAAAAAAAAAAADrPSAQ/original',
                    title: botProfile?.name || 'PeterCat',
                  }}
                  style={{
                    backgroundColor: '#FCFCFC',
                  }}
                  apiDomain={API_HOST}
                  apiUrl="/api/chat/stream_qa"
                  prompt={botProfile?.prompt}
                  starters={botProfile?.starters}
                  helloMessage={botProfile?.helloMessage}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
