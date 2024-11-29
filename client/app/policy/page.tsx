'use client';

import React, { useMemo } from 'react';
import HomeHeader from '@/components/HomeHeader';
import Markdown from '@/components/Markdown';
import { useGlobal } from '@/app/contexts/GlobalContext';
import PolicyZhCN from '../../.kiwi/zh-CN/policy.md';
import PolicyEN from '../../.kiwi/en/policy.md';
import PolicyJA from '../../.kiwi/ja/policy.md';
import PolicyKO from '../../.kiwi/ko/policy.md';
import PolicyZhTW from '../../.kiwi/zh-TW/policy.md';

export default function Policy() {
  const { language } = useGlobal();

  const markdownContent = useMemo(() => {
    switch (language) {
      case 'zh-CN':
        return PolicyZhCN;
      case 'zh-TW':
        return PolicyZhTW;
      case 'ja':
        return PolicyJA;
      case 'ko':
        return PolicyKO;
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
