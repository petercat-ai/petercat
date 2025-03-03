'use client';

import { useSearchParams } from 'next/navigation';
import React from 'react';
import { KnowledgePageHeader } from './components/Header';
import KnowledgeList from './components/KnowledgeList';

export default function KnowledgePage() {
  const searchParams = useSearchParams();
  const repo_name = searchParams.get('repo_name');
  const bot_id = searchParams.get('bot_id');
  return (
    <div className="w-full h-screen bg-zinc-100 flex-col justify-start items-start inline-flex overflow-hidden">
      <KnowledgePageHeader
        repo_name={repo_name ?? ''}
        bot_id={bot_id ?? 'new'}
      ></KnowledgePageHeader>
      <KnowledgeList repo_name={repo_name ?? ''}></KnowledgeList>
    </div>
  );
}
