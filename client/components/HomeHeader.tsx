'use client';
import React, { Suspense, useState, useEffect } from 'react';
import GitHubIcon from '@/public/icons/GitHubIcon';
import MenuIcon from '@/public/icons/MenuIcon';
import StarIcon from '@/public/icons/StarIcon';
import Image from 'next/image';
import I18N from '@/app/utils/I18N';
import { Link } from '@nextui-org/react';
import GitHubStars from '@/components/GitHubStars';
import LanguageSwitcher from '@/components/LangSwitcher';

const HomeHeader = () => {
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
  return (
    <header
      className={`h-20 px-6 lg:px-10 mx-auto flex items-center group${
        showMobileNav ? ' mobile-nav-expanded' : ''
      }`}
    >
      <span className="flex-1">
        <Link href="/">
          <Image
            width={114}
            height={32}
            src="/images/logo-inverse.svg"
            alt="petercat"
            className="h-8"
          />
        </Link>
      </span>
      <nav
        className={`${
          showMobileNav ? '' : 'hidden '
        }absolute z-10 top-20 left-0 right-0 bottom-0 flex flex-col text-center bg-black lg:block lg:static lg:bg-auto`}
      >
        <a
          href="https://www.youtube.com/@petercat-ai"
          className="mt-8 text-white lg:mt-0 lg:text-[#f4f4f5] lg:opacity-60 transition-opacity hover:opacity-90"
          target="_blank"
        >
          {I18N.app.page.yanShiAnLi}
        </a>
        <a
          href="/market"
          className="mt-8 text-white lg:mt-0 lg:ml-8 lg:text-[#f4f4f5] lg:opacity-60 transition-opacity hover:opacity-90"
        >
          {I18N.app.page.gongZuoTai}
        </a>
        <a
          href="https://github.com/petercat-ai/petercat/blob/main/README.md"
          className="mt-8 text-white lg:mt-0 lg:ml-8 lg:text-[#f4f4f5] lg:opacity-60 transition-opacity hover:opacity-90"
          target="_blank"
        >
          {I18N.app.page.wenDang}
        </a>
        <a
          href="/release"
          className="mt-8 text-white lg:mt-0 lg:ml-8 lg:text-[#f4f4f5] lg:opacity-60 transition-opacity hover:opacity-90"
        >
          {I18N.app.page.release}
        </a>
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
        <a
          className="lg:hidden w-10 h-10 inline-block bg-white/[0.15] transition-colors hover:bg-white/[0.3] text-white rounded-full leading-10 text-center"
          onClick={() => setShowMobileNav((v) => !v)}
        >
          <MenuIcon className="inline translate-x-0.5" />
        </a>
      </div>
    </header>
  );
};

export default HomeHeader;
