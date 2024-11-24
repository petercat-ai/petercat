'use client';

import React, { useState, Suspense, useEffect, useMemo } from 'react';
import Image from 'next/image';
import GitHubIcon from '@/public/icons/GitHubIcon';
import StarIcon from '@/public/icons/StarIcon';
import LanguageSwitcher from '@/components/LangSwitcher';
import Markdown from '@/components/Markdown';
import { useGlobal } from '@/app/contexts/GlobalContext';
import GitHubStars from '@/components/GitHubStars';
import { ThemeProvider } from 'antd-style';

import PolicyZhCN from '../../.kiwi/zh-CN/policy.md';
import PolicyEN from '../../.kiwi/en/policy.md';

export default function Policy() {
  const { language } = useGlobal();
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [stars, setStars] = useState<number | null>(null);
  useEffect(() => {
    async function getStars() {
      const starsData = await GitHubStars();
      setStars(starsData);
    }

    if (stars === null) {
      getStars();
    }
  }, [stars]);
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
      <header
        className={`h-20 px-6 lg:px-10 mx-auto flex items-center group${
          showMobileNav ? ' mobile-nav-expanded' : ''
        }`}
      >
        <span className="flex-1">
          <Image
            width={114}
            height={32}
            src="/images/logo-inverse.svg"
            alt="petercat"
            className="h-8"
          />
        </span>
        <nav
          className={`${
            showMobileNav ? '' : 'hidden '
          }absolute z-10 top-20 left-0 right-0 bottom-0 flex flex-col text-center bg-black lg:block lg:static lg:bg-auto`}
        >
          <a
            className="mt-8 text-white lg:hidden"
            onClick={() => setShowMobileNav(false)}
          >
            <Image
              width={24}
              height={24}
              src="/images/icon-close.svg"
              alt="close"
              className="mx-auto h-6"
            />
          </a>
        </nav>
        <div className="flex-1 flex justify-end">
          <span className="group-[.mobile-nav-expanded]:opacity-60">
            <LanguageSwitcher />
          </span>
          <a
            href="https://github.com/petercat-ai/petercat"
            className="lg:min-w-[100px] whitespace-nowrap text-sm lg:text-base pl-2 pr-3 lg:px-4 h-10 inline-block bg-white/[0.15] transition-colors hover:bg-white/[0.3] text-white rounded-full leading-10 lg:leading-10 text-center mr-4 group-[.mobile-nav-expanded]:opacity-60"
            target="_blank"
          >
            <GitHubIcon className="hidden lg:inline scale-75 -translate-y-0.5" />
            <StarIcon className="lg:hidden inline translate-y-0.5 translate-x-0.5" />
            <Suspense>
              <span id="github-stars-wrapper">{stars}</span>
            </Suspense>
            <span className="hidden lg:inline">stars</span>
          </a>
        </div>
      </header>
      <div className="max-w-3xl mx-auto px-6 lg:px-10 py-20">
        <ThemeProvider appearance="dark">
          <Markdown markdownContent={markdownContent} />
        </ThemeProvider>
      </div>
    </div>
  );
}
