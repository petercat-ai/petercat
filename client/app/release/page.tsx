'use client';

import React from 'react';
import I18N from '@/app/utils/I18N';
import Image from 'next/image';
import HomeHeader from '@/components/HomeHeader';
import HomeFooter from '@/components/HomeFooter';

export default function Release() {
  const releaseNotes = [
    {
      date: 'NOV 22 / 2024',
      version: '1.0.1',
      title: I18N.release.page.guoJiHuaZhiChi,
      summary: I18N.release.page.quanLianLuGuoJi,
      url: 'https://link.medium.com/QOA4Ed8NUOb',
    },
    {
      date: 'SEP 6 / 2024',
      version: '1.0.0',
      title: I18N.release.page.waiTanDaHuiShou,
      summary: I18N.release.page.xiaoMaoMiJiQi,
      url: 'https://mp.weixin.qq.com/s/PnHVc1_yBPu2HiA2En9cAg',
    },
  ];
  return (
    <div className="section bg-black">
      <HomeHeader />
      <div className="w-full h-[400px] flex flex-col justify-center items-center text-center">
        <h2 className="mb-6 lg:mb-8 text-2xl leading-[32px] lg:text-5xl lg:leading-[64px] text-white">
          {I18N.app.page.release}
        </h2>
        <p className="mb-6 lg:mb-8 text-sm px-9 lg:text-xl text-white">
          {I18N.release.page.guanZhu}<Image
            className="inline scale-85 origin-top-center"
            style={{ filter: 'saturate(0)' }}
            width={106}
            height={20}
            src="/images/logo-footer.svg"
            alt="PeterCat"
          />
          {I18N.release.page.zuiXinChanPinXin}</p>
        <a
          className="inline-block px-5 py-2 lg:px-8 lg:py-3 rounded-full border-2 border-white text-white text-sm lg:text-xl transition-transform hover:scale-105"
          href="https://github.com/petercat-ai/petercat/releases"
          target="_blank"
        >
          GitHub Release Notes
        </a>
      </div>
      <div className="container mx-auto px-4">
        {releaseNotes.map((note, index) => (
          <div
            key={index}
            className="flex flex-col lg:flex-row lg:justify-between  border-t border-[#7F7A71] py-4 lg:py-8 px-5 lg:px-6"
          >
            <div className="flex flex-col items-start lg:w-[320px] lg:mr-[60px] lg:w-auto">
              <p className="text-white text-sm lg:text-xl my-1 lg:my-2 lg:mr-4">
                {note.date}
              </p>
              <span className="bg-[#7C3AED] text-white text-xs lg:text-sm px-2 py-1 rounded-full inline-block self-start lg:self-auto mb-2 lg:mb-0">
                V{note.version}
              </span>
            </div>
            <a
              className="flex-1 cursor-pointer"
              target="_blank"
              href={note.url}
            >
              <h3 className="text-[#FFA700] font-solitreo text-lg lg:text-3xl my-1 lg:my-2">
                {note.title}
              </h3>
              <p className="text-white text-xs lg:text-base">{note.summary}</p>
            </a>
          </div>
        ))}
      </div>
      <HomeFooter />
    </div>
  );
}
