'use client';
import React from 'react';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { Spinner } from '@nextui-org/react';
import { useBotDetail } from './hooks/useBot';

const BotDetail = (props: { id: string }) => {
  const { data: detail, isLoading, error } = useBotDetail(props?.id);

  if (error) {
    return <div>Error loading bot!</div>;
  }

  return (
    <>
      {isLoading && (
        <div className="fixed top-0 left-0 right-0 bottom-0 z-50 flex justify-center items-center bg-white bg-opacity-75">
          <Spinner />
        </div>
      )}
      <ChatWindow
        endpoint="/api/chat"
        avatar={detail?.avatar!}
        name={detail?.name!}
        starters={detail?.starters!}
        description={detail?.description!}
        placeholder={detail?.description || 'Ask me anything!'}
        enableImgGeneration={detail?.enable_img_generation!}
        botId={detail?.id!}
        voice={detail?.voice ?? undefined}
        streamming
      />
    </>
  );
};

export default BotDetail;
