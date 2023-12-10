'use client';
import { Tables } from '@/types/database.types';
import React, { useEffect, useState } from 'react';
import { ChatWindow } from '@/components/ChatWindow';
import { Skeleton } from '@nextui-org/react';

declare type Bot = Tables<'bots'>;

const BotDetail = (props: { id: string }) => {
  const [detail, setDetail] = useState<Bot>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (!props?.id) {
      return;
    }
    fetch(`/api/bot/detail?id=${props.id}`)
      .then((res) => res.json())
      .then((data) => {
        setDetail(data?.data?.[0]);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Failed to fetch detail', error);
        setError(error);
        setLoading(false);
      });
  }, [props]);

  if (error) {
    return <div>Error loading bot!</div>;
  }

  const BotDetailCard = (
    <div className="p-4 md:p-8 rounded bg-[#ffffff] w-full max-h-[85%] overflow-hidden flex items-center">
      <Skeleton isLoaded={!loading} className="h-24 w-24 rounded-full">
        <img
          className="w-24 rounded-full"
          src={detail?.avatar || ''}
          alt={detail?.name || ''}
        />
      </Skeleton>
      <Skeleton isLoaded={!loading} className="w-full h-20 rounded-lg ml-4">
        <div>
          <h1 className="text-3xl md:text-4xl mb-4">{detail?.name}</h1>
          <div>{detail?.description}</div>
        </div>
      </Skeleton>
    </div>
  );
  return (
    <>
      <ChatWindow
        endpoint="/api/chat"
        avatar={detail?.avatar || ''}
        titleText={detail?.name || 'Bot'}
        placeholder={detail?.description || 'Ask me anything!'}
        emptyStateComponent={BotDetailCard}
        prompt={detail?.prompt || ''}
      />
    </>
  );
};

export default BotDetail;
