import I18N from '@/app/utils/I18N';
'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import ChunkList from '../components/ChunkList';
import { Button } from '@nextui-org/react';

export default function ChunkPage() {
  const searchParams = useSearchParams();
  const knowledge_id = searchParams.get('knowledge_id');
  const router = useRouter();
  if (!knowledge_id) {
    router.push('/');
  }
  return (
    <div className="w-full h-screen bg-zinc-100 flex-col justify-start items-start inline-flex overflow-hidden p-4">
      <div
        onClick={() => router.back()}
        className="p-2 flex gap-2 cursor-pointer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
        {I18N.chunk.page.fanHui}</div>
      <ChunkList knowledge_id={knowledge_id!} />
    </div>
  );
}
