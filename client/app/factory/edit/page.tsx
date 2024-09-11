'use client';
import React, { useCallback, useEffect, useMemo } from 'react';
import { Tabs, Tab, Button, Input, Avatar } from '@nextui-org/react';
import BotCreateFrom from '@/app/factory/edit/components/BotCreateFrom';
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
import KnowledgeBtn from './components/KnowledgeBtn';
import { BotTaskProvider } from './components/TaskContext';
import { useSearchParams } from 'next/navigation';
import 'react-toastify/dist/ReactToastify.css';
import { extractFullRepoNameFromGitHubUrl } from '@/app/utils/tools';

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
  const { botProfile, setBotProfile } = useBot();
  const { data: user, status } = useUser();
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
  const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN;

  useEffect(() => {
    if (!user || status !== 'success' || user.id.startsWith('client|')) {
      router.push(`${apiDomain}/api/auth/login`);
    }
  }, [user, status]);

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
          draft.repoName = data.repoName;
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
        draft.repoName = config.repo_name ?? '';
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
  }, [getBotInfoByRepoNameSuccess]);

  useEffect(() => {
    if (editSuccess) {
      toast.success('生成失败');
    }
  }, [getBotInfoByRepoNameError]);

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

  if (isLoading || getBotInfoByRepoNameLoading) {
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
        style={{
          backgroundColor: '#fff',
        }}
        hideLogo={true}
        apiUrl="/api/chat/stream_builder"
        apiDomain={API_HOST}
        helloMessage="初次见面，先自我介绍一下：我是一个开源项目的机器人。你可以通过和我对话配置一个答疑机器人。"
        starters={['帮我配置一个答疑机器人']}
        getToolsResult={(result) => {
          const data = result?.data;
          updateConfigFromChatResult(data);
        }}
      />
    </div>
  );
  const manualConfigLabel = (
    <div className="flex justify-between">
      <span>Github 项目地址</span>
      {botProfile.id && (
        <CopyToClipboard
          text={botProfile.id}
          onCopy={() => {
            toast.success('Token 已复制到剪贴板');
          }}
        >
          {/* @ts-ignore */}
          <span className="text-xs text-gray-500 cursor-pointer">
            复制 Token
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
          placeholder="请输入 GitHub 项目地址"
          labelPlacement="outside"
          onChange={(e) => {
            const url = e.target.value;
            setGitUrl(url);
          }}
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
                    onCreateBot(repoName!);
                  } else {
                    toast.error('地址有误');
                  }
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
                getBotInfoByRepoName(botProfile?.repoName!);
              }}
            >
              重新生成配置
            </Button>
          )}
          {isEdit && activeTab === ConfigTypeEnum.MANUAL_CONFIG && (
            <KnowledgeBtn
              botId={botProfile.id}
              onClick={() => {
                setVisibleType(VisibleTypeEnum.KNOWLEDGE_DETAIL);
              }}
              mode={'configItem'}
            />
          )}
        </div>
      </div>

      {isEdit && <BotCreateFrom />}
    </div>
  );

  return (
    <BotTaskProvider>
      <div className="flex h-full w-full flex-col items-center bg-white mb-[-40px] overflow-hidden">
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
                        base: 'w-[230px] h-[36px]',
                        tab: 'shadow-none w-[108px] h-[36px] px-0 py-0',
                        tabContent:
                          'group-data-[selected=true]:bg-[#FAE4CB] rounded-full px-3 py-2 w-[108px] h-[36px]',
                        cursor: 'shadow-none rounded-full w-[108px]',
                      }}
                    >
                      <Tab
                        key={ConfigTypeEnum.CHAT_CONFIG}
                        title={
                          <div className="flex items-center space-x-2 text-[#000] group-data-[selected=true]:text-[#000]">
                            <ChatIcon /> <span className="ml-2">对话调试</span>
                          </div>
                        }
                      />

                      <Tab
                        key={ConfigTypeEnum.MANUAL_CONFIG}
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
                    {/* TODO 暂时关闭上架入口 */}
                    {/* <PublicSwitcher 
                      isSelected={!!botProfile?.public}
                      setBotProfile={setBotProfile}
                    /> */}
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
                    disabledPlaceholder="机器人尚未配置任何内容    请在完成配置后进行对话测试"
                    disabled={!isEdit}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}
        {visibleType === VisibleTypeEnum.KNOWLEDGE_DETAIL ? (
          <Knowledge
            botId={botProfile.id}
            goBack={() => {
              setVisibleType(VisibleTypeEnum.BOT_CONFIG);
            }}
          ></Knowledge>
        ) : (
          <></>
        )}
      </div>
    </BotTaskProvider>
  );
}
