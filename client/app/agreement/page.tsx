'use client';

import React, { useMemo } from 'react';
import HomeHeader from '@/components/HomeHeader';
import Markdown from '@/components/Markdown';
import { useGlobal } from '@/app/contexts/GlobalContext';

import { ThemeProvider } from 'antd-style';

import AgreementZhCN from '../../.kiwi/zh-CN/agreement.md';
import AgreementEN from '../../.kiwi/en/agreement.md';

export default function Agreement() {
  const { language } = useGlobal();

  const markdownContent = useMemo(() => {
    switch (language) {
      case 'zh-CN':
        return AgreementZhCN;
      case 'en':
        return AgreementEN;
      default:
        return AgreementEN;
    }
  }, [language]);
  return (
    <div className="section bg-black">
      <HomeHeader />
      <div className="max-w-3xl mx-auto px-6 lg:px-10 py-20">
        <ThemeProvider appearance="dark">
          <Markdown markdownContent={markdownContent} />
        </ThemeProvider>
      </div>
    </div>
  );
}
