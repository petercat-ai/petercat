'use client';
import React from 'react';
import { Spinner } from '@nextui-org/react';
import { useBotDetail } from '@/app/hooks/useBot';

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
    </>
  );
};

export default BotDetail;
