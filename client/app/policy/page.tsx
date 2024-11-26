'use client';

import React, { useMemo } from 'react';
import HomeHeader from '@/components/HomeHeader';
import Markdown from '@/components/Markdown';
import { useGlobal } from '@/app/contexts/GlobalContext';

import PolicyZhCN from '../../.kiwi/zh-CN/policy.md';
import PolicyEN from '../../.kiwi/en/policy.md';

export default function Policy() {
  const { language } = useGlobal();

  const markdownContent = useMemo(() => {
    switch (language) {
      case 'zh-CN':
        return PolicyZhCN;
      case 'en':
        return PolicyEN;
      default:
        return PolicyEN;
    }
  }, [language]);
  return (
    <div className="section bg-black">
      <HomeHeader />
      <div className="max-w-3xl mx-auto px-6 lg:px-10 py-20">
        <Markdown markdownContent={markdownContent} />
      </div>
    </div>
  );
}
