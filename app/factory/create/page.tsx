'use client';
import React from 'react';
import { Tabs, Tab, Button } from '@nextui-org/react';
import BotCreateFrom from '@/app/factory/create/components/BotCreateFrom';
import { ChatWindow } from '@/components/ChatWindow';
import { useBot } from './hooks/useBot';
import { toast } from 'react-toastify';

export default function Create() {
  const {
    onCreateBot,
    createBotLoading,
    onUpdateBot,
    updateBotLoading,
    botProfile,
    setBotProfile,
  } = useBot();

  const createBot = async () => {
    const params = {
      ...botProfile,
      starters: botProfile?.starters?.filter((s) => s),
    };

    try {
      const response = await onCreateBot(params);
      if (response.ok) {
        const data = await response.json();
        setBotProfile?.((draft) => {
          draft.id = data.data?.id;
        });
        toast.success('Save success');
      } else {
        toast.error('Save failed');
      }
    } catch (error) {
      console.error('Save failed:', error);
      toast.error('Save failed');
    }
  };

  const updateBot = async () => {
    const params = {
      ...botProfile,
      starters: botProfile?.starters?.filter((s) => s),
    };

    try {
      const response = await onUpdateBot(params);
      if (response.ok) {
        await response.json();
        toast.success('Save success');
      } else {
        toast.error('Save failed');
      }
    } catch (error) {
      console.error('Save failed:', error);
      toast.error('Save failed');
    }
  };

  return (
    <div className="flex h-screen w-full flex-col items-center">
      <div className="relative flex h-14 w-full items-center justify-between gap-2 border-b border-token-border-medium px-3 flex-shrink-0">
        <a
          className="text-slate-500 hover:text-blue-600 flex items-center gap-2"
          href="/"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="icon-lg"
          >
            <path
              d="M15 5L8 12L15 19"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
        </a>
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
            avatar={''}
            titleText={'Bot'}
            placeholder={'Ask me anything!'}
            emptyStateComponent={<div className="self-center f">Preview</div>}
            prompt={''}
            streamming
          />
        </div>
      </div>
    </div>
  );
}
