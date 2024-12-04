'use client';

import React from 'react';
import I18N from '@/app/utils/I18N';
import Image from 'next/image';
import HomeHeader from '@/components/HomeHeader';
import HomeFooter from '@/components/HomeFooter';

export default function Release() {
  return (
    <div className="section bg-black">
      <HomeHeader />
      <div className="w-full h-[400px] flex flex-col justify-center items-center text-center">
        <h2 className="mb-6 lg:mb-8 text-2xl leading-[32px] lg:text-5xl lg:leading-[64px] text-white">
          {I18N.app.page.release}
        </h2>
        <p className="mb-6 lg:mb-8 text-sm px-9 lg:text-xl text-white">
          关注
          <Image
            className="inline scale-85 origin-top-center"
            style={{ filter: 'saturate(0)' }}
            width={106}
            height={20}
            src="/images/logo-footer.svg"
            alt="PeterCat"
          />
          最新产品新闻， 以便在新版能力发布时获取最新信息
        </p>
        <a
          className="inline-block px-5 py-2 lg:px-8 lg:py-3 rounded-full border-2 border-white text-white text-sm lg:text-xl transition-transform hover:scale-105"
          href="https://github.com/petercat-ai/petercat/releases"
          target="_blank"
        >
          GitHub Release Notes
        </a>
      </div>
      <HomeFooter />
    </div>
  );
}
