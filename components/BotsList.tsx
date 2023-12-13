'use client';
import { Tables } from '@/types/database.types';
import React, { useEffect, useState } from 'react';
import { isEmpty, map } from 'lodash';
import { Avatar, Spinner } from '@nextui-org/react';

declare type Bots = Tables<'bots'>[];
declare type Bot = Tables<'bots'>;

const Card = (props: { bot: Bot }) => {
  const { bot } = props;

  return (
    <a
      className="mx-auto bg-white rounded-lg border border-gray-200  shadow-md flex items-center overflow-hidden w-full hover:bg-gray-100 cursor-pointer"
      href={`/chat/${bot.id}`}
    >
      <Avatar
        src={bot?.avatar!}
        className="h-24 w-24 text-large m-4"
        name={bot?.name!}
      />
      <div className="flex flex-col justify-between p-4 leading-normal">
        <h5 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white hover:text-blue-500 transition-colors duration-30">
          {bot.name}
        </h5>
        <p className="text-gray-700 text-base overflow-hidden overflow-ellipsis whitespace-nowrap hover:whitespace-normal hover:overflow-visible">
          {bot.description}
        </p>
        <div>
          <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
            {bot.label}
          </span>
        </div>
      </div>
    </a>
  );
};

const FullPageSkeleton = () => {
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 z-50 flex justify-center items-center bg-white bg-opacity-75">
      <Spinner />
    </div>
  );
};

const BotsList = () => {
  const [bots, setBots] = useState<Bots>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/bot/list')
      .then((res) => res.json())
      .then((data) => {
        setBots(data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Failed to fetch bots', error);
        setError(error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <FullPageSkeleton />;
  }
  if (error) {
    return <div>Error loading bots!</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 p-4">
      {!isEmpty(bots) &&
        map(bots, (bot: Bot) => <Card key={bot.id} bot={bot} />)}
    </div>
  );
};

export default BotsList;
