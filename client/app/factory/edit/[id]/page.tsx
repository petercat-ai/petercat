'use client';
import React, { useEffect, useMemo } from 'react';
import { Tabs, Tab, Button, Switch } from '@nextui-org/react';
import BotCreateFrom from '@/app/factory/edit/components/BotCreateFrom';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { toast } from 'react-toastify';
import { BotProfile } from '@/app/interface';
import BackIcon from '@/public/icons/BackIcon';
import { useBotConfig, useBotCreate, useBotEdit } from '@/app/hooks/useBot';
import PublicSwitcher from '@/app/factory/edit/components/PublicSwitcher';
import FullPageSkeleton from '@/components/FullPageSkeleton';
import { isEmpty } from 'lodash';
import { useImmer } from 'use-immer';

export default function Edit({ params }: { params: { id: string } }) {
  const [botProfile, setBotProfile] = useImmer<BotProfile>({
    id: '',
    avatar: '',
    name: 'Untitled',
    description: '',
    prompt: '',
    starters: [''],
    enable_img_generation: true,
    voice: '',
    public: false,
  });

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

  const isEdit = useMemo(
    () => !!params?.id && params?.id !== 'new',
    [params?.id],
  );

  const { data: config, isLoading } = useBotConfig(params?.id, isEdit);

  useEffect(() => {
    if (!isEmpty(config))
      setBotProfile?.((draft) => {
        draft.id = config.id;
        draft.name = config.name || '';
        draft.description = config.description || '';
        draft.avatar = config.avatar || '';
        draft.enable_img_generation = config.enable_img_generation ?? false;
        draft.voice = config.voice || '';
        draft.starters = config.starters || [''];
        draft.prompt = config.prompt || '';
        draft.public = config.public ?? false;
      });
  }, [config]);

  const createBot = async () => {
    const params = {
      ...botProfile,
      starters: botProfile?.starters?.filter((s) => s),
    };
    onCreateBot(params);
  };

  const updateBot = async () => {
    const params = {
      ...botProfile,
      starters: botProfile?.starters?.filter((s) => s),
    };
    onUpdateBot(params);
  };

  useEffect(() => {
    if (createSuccess) {
      toast.success('Save success');
    }
  }, [createSuccess]);

  useEffect(() => {
    if (createError) {
      toast.error(`Save failed${createError.message}`);
    }
  }, [createError]);

  useEffect(() => {
    if (createResponseData) {
      setBotProfile?.((draft) => {
        draft.id = createResponseData;
      });
    }
  }, [createResponseData]);

  useEffect(() => {
    if (editError) {
      toast.error(`Save failed${editError.message}`);
    }
  }, [editError]);

  useEffect(() => {
    if (editSuccess) {
      toast.success('Save success');
    }
  }, [editSuccess]);

  useEffect(() => {
    if (editError) {
      toast.error(`Save failed${editError.message}`);
    }
  }, [editError]);

  if (isLoading) {
    return <FullPageSkeleton />;
  }

  return (
    <div className="flex h-screen w-full flex-col items-center bg-white">
      <div className="relative flex h-14 w-full items-center justify-between gap-2 border-b border-token-border-medium px-3 flex-shrink-0">
        <div className="flex items-center gap-2">
          <a
            className="text-slate-500 hover:text-blue-600 flex items-center gap-2"
            href="/factory/list"
          >
            <BackIcon />
          </a>
          <div className="flex items-center gap-2">
            <PublicSwitcher
              isSelected={!!botProfile?.public}
              setBotProfile={setBotProfile}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            color="success"
            size="sm"
            isLoading={createBotLoading || updateBotLoading}
            variant="flat"
            onClick={(e) => {
              e.preventDefault();
              if (botProfile?.id) {
                updateBot();
              } else {
                createBot();
              }
            }}
          >
            Save
          </Button>
        </div>
      </div>
      <div className="relative flex w-full grow overflow-hidden">
        <div className="flex w-full justify-center md:w-1/2">
          <div className="h-full grow overflow-y-auto overflow-x-hidden">
            <div className="flex h-full flex-col px-2 pt-2">
              <Tabs
                disabledKeys={['Builder']}
                defaultSelectedKey="Configure"
                aria-label="Options"
                className="self-center"
              >
                <Tab key="Builder" title="Builder" disabled>
                  <ChatWindow
                    endpoint="/api/chat"
                    avatar={''}
                    titleText={'Bot'}
                    placeholder={'Ask me anything!'}
                    emptyStateComponent={<></>}
                    prompt={''}
                    streamming
                  />
                </Tab>
                <Tab key="Configure" title="Configure">
                  <BotCreateFrom
                    setBotProfile={setBotProfile}
                    botProfile={botProfile}
                  />
                </Tab>
              </Tabs>
            </div>
          </div>
        </div>
        <div className="hidden w-1/2 justify-center bg-default-100 border-l border-token-border-medium bg-token-surface-secondary pt-4 md:flex relative">
          <ChatWindow
            endpoint="/api/chat"
            avatar={botProfile?.avatar}
            name={botProfile?.name}
            titleText="Preview"
            description={botProfile?.description!}
            starters={botProfile?.starters!}
            prompt={botProfile?.prompt}
            voice={botProfile?.voice}
            enableImgGeneration={botProfile?.enable_img_generation}
            streamming
          />
        </div>
      </div>
    </div>
  );
}
