'use client';
import { Tables } from '@/types/database.types';
import React, { useEffect, useState } from 'react';
import { ChatWindow } from '@/components/ChatWindow';
import { Spinner } from '@nextui-org/react';

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

  return (
    <>
      {loading && (
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
        prompt={detail?.prompt!}
        streamming
      />
    </>
  );
};

export default BotDetail;
