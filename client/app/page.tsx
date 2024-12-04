'use client';
import dynamic from 'next/dynamic';
import React from 'react';
import { RefObject, useCallback, useEffect, useRef, useState } from 'react';
import I18N from '@/app/utils/I18N';
import Image from 'next/image';
import Fullpage, { fullpageOptions } from '@fullpage/react-fullpage';
import { LottieRefCurrentProps } from 'lottie-react';
import LottieLightningCat from '@/app/assets/lightning_cat.json';
import LottieHelixCat from '@/app/assets/helix_cat.json';
import LottieOctopusCat from '@/app/assets/octopus_cat.json';
import HomeHeader from '@/components/HomeHeader';
import HomeFooter from '@/components/HomeFooter';
import { useGlobal } from '@/app/contexts/GlobalContext';

const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

// play same video util refresh page
const PC_EXAMPLE_VIDEO = [
  'https://gw.alipayobjects.com/v/huamei_ghirdt/afts/video/A*7lc3QKRnuYAAAAAAAAAAAAAADuH-AQ',
  'https://gw.alipayobjects.com/v/huamei_ghirdt/afts/video/A*TmIsT7SUWPsAAAAAAAAAAAAADuH-AQ',
  'https://gw.alipayobjects.com/v/huamei_ghirdt/afts/video/A*UaYESbe_mJMAAAAAAAAAAAAADuH-AQ',
];

const PC_EXAMPLE_VIDEO_EN = [
  'https://gw.alipayobjects.com/v/huamei_j8gzmo/afts/video/A*Bem2RrQ_kMYAAAAAAAAAAAAADrPSAQ',
  'https://gw.alipayobjects.com/v/huamei_j8gzmo/afts/video/A*4cD8RYM9rPwAAAAAAAAAAAAADrPSAQ',
  'https://gw.alipayobjects.com/v/huamei_j8gzmo/afts/video/A*mwwRQbOza3IAAAAAAAAAAAAADrPSAQ',
];

const MOBILE_EXAMPLE_VIDEO = [
  'https://gw.alipayobjects.com/v/huamei_ghirdt/afts/video/A*izMfSbJJXLoAAAAAAAAAAAAADuH-AQ',
  'https://gw.alipayobjects.com/v/huamei_ghirdt/afts/video/A*tuaNRbG-5q4AAAAAAAAAAAAADuH-AQ',
  'https://gw.alipayobjects.com/v/huamei_ghirdt/afts/video/A*sxvhTafMlIoAAAAAAAAAAAAADuH-AQ',
  'https://gw.alipayobjects.com/v/huamei_ghirdt/afts/video/A*wFfqQ6XBd2EAAAAAAAAAAAAADuH-AQ',
];

const MOBILE_EXAMPLE_VIDEO_EN = [
  'https://gw.alipayobjects.com/v/huamei_j8gzmo/afts/video/A*yCzxQrgIGqAAAAAAAAAAAAAADrPSAQ',
  'https://gw.alipayobjects.com/v/huamei_j8gzmo/afts/video/A*h0oDTo5BdI4AAAAAAAAAAAAADrPSAQ',
  'https://gw.alipayobjects.com/v/huamei_j8gzmo/afts/video/A*DUc0TaJVpkAAAAAAAAAAAAAADrPSAQ',
  'https://gw.alipayobjects.com/v/huamei_j8gzmo/afts/video/A*CjTOQKHtEnsAAAAAAAAAAAAADrPSAQ',
  'https://gw.alipayobjects.com/v/huamei_j8gzmo/afts/video/A*2WtmRaBv6eAAAAAAAAAAAAAADrPSAQ',
];

export default function Homepage() {
  const videoRefs = {
    banner: useRef<HTMLVideoElement>(null),
    pcCase: useRef<HTMLVideoElement & { _timer: number }>(null),
    mobileCase: useRef<HTMLVideoElement & { _timer: number }>(null),
  };
  const bannerActionRef = useRef<HTMLDivElement>(null);
  const lightningCatRef = useRef<LottieRefCurrentProps>(null);
  const helixCatRef = useRef<LottieRefCurrentProps>(null);
  const helixOctopusRef = useRef<LottieRefCurrentProps>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const showCaseRef = useRef<HTMLDivElement>(null);
  const [videos, setVideos] = useState<{ pc: string; mobile: string }>();
  const { language } = useGlobal();

  const scrollHandler = useCallback<
    NonNullable<fullpageOptions['onScrollOverflow']>
  >(() => {
    const isActionInView =
      bannerActionRef.current?.getBoundingClientRect().bottom! <=
      window.innerHeight;
    const isActionVisible =
      bannerActionRef.current?.classList.contains('opacity-0');

    if (isActionInView && isActionVisible) {
      bannerActionRef.current!.classList.remove('opacity-0');
      bannerActionRef.current!.classList.remove('translate-y-8');
    } else if (!isActionInView && !isActionVisible) {
      bannerActionRef.current!.classList.add('opacity-0');
      bannerActionRef.current!.classList.add('translate-y-8');
    }
  }, []);

  const playAnimation = useCallback(
    (
      animationRef: RefObject<{ goToAndPlay: (frame: number) => void }>,
      play: boolean = true,
    ) => {
      if (play) {
        requestAnimationFrame(() => animationRef.current?.goToAndPlay(0));
      }
    },
    [],
  );

  const updateClasses = useCallback(
    (addTableClass: boolean, addShowCaseClass: boolean) => {
      requestAnimationFrame(() => {
        if (addTableClass) {
          tableRef.current?.classList.add('animate-borders');
        } else {
          tableRef.current?.classList.remove('animate-borders');
        }

        if (addShowCaseClass) {
          showCaseRef.current?.classList.add('animate-border-group');
        } else {
          showCaseRef.current?.classList.remove('animate-border-group');
        }
      });
    },
    [tableRef, showCaseRef],
  );

  const leaveHandler = useCallback<NonNullable<fullpageOptions['beforeLeave']>>(
    (_, dest) => {
      if (dest.isFirst) {
        requestAnimationFrame(() => {
          videoRefs.banner.current?.play();
          updateClasses(false, false);
        });
      } else {
        switch (dest.index) {
          case 1:
            playAnimation(helixOctopusRef);
            updateClasses(true, false);
            break;
          case 2:
            playAnimation(lightningCatRef);
            updateClasses(false, false);
            break;
          case 3:
            playAnimation(helixCatRef);
            break;
          default:
            updateClasses(false, false);
            break;
        }
      }
    },
    [],
  );
  const enterHandler = useCallback<NonNullable<fullpageOptions['afterLoad']>>(
    (_, dest) => {
      if (dest.index === 2) {
        lightningCatRef.current?.goToAndPlay(0);
      } else if (dest.index === 3) {
        updateClasses(false, true);

        // play video after transition
        const [{ current: pcElm }, { current: mobileElm }] = [
          videoRefs.pcCase,
          videoRefs.mobileCase,
        ];
        if (pcElm && mobileElm) {
          clearTimeout(pcElm._timer);
          pcElm._timer = window.setTimeout(() => {
            pcElm.currentTime = 0;
            pcElm.play();
            mobileElm.currentTime = 0;
            mobileElm.play();
          }, 1333);
        }
      }
    },
    [],
  );

  useEffect(() => {
    const videoUpdateHandler = () => {
      if (
        videoRefs.banner.current!.currentTime >
        videoRefs.banner.current!.duration - 0.02
      ) {
        videoRefs.banner.current!.currentTime = 5;
        videoRefs.banner.current!.play();
      } else if (videoRefs.banner.current!.currentTime > 2.5) {
        // try to display banner action for large screen (no scroll bar)
        // @ts-ignore
        scrollHandler();
      }
    };

    videoRefs.banner.current?.addEventListener(
      'timeupdate',
      videoUpdateHandler,
    );

    const pcVideos =
      language === 'zh-CN' || language === 'zh-TW'
        ? PC_EXAMPLE_VIDEO
        : PC_EXAMPLE_VIDEO_EN;
    const mbVideos =
      language === 'zh-CN' || language === 'zh-TW'
        ? MOBILE_EXAMPLE_VIDEO
        : MOBILE_EXAMPLE_VIDEO_EN;
    setVideos({
      pc: pcVideos[Math.floor(Math.random() * pcVideos?.length)],
      mobile: mbVideos[Math.floor(Math.random() * mbVideos?.length)],
    });

    return () => {
      videoRefs.banner.current?.removeEventListener(
        'timeupdate',
        videoUpdateHandler,
      );
      if (videoRefs.pcCase.current) {
        clearTimeout(videoRefs.pcCase.current!._timer);
      }
    };
  }, [language]);

  return (
    <Fullpage
      onScrollOverflow={scrollHandler}
      beforeLeave={leaveHandler}
      afterLoad={enterHandler}
      credits={{}}
      render={() => (
        <Fullpage.Wrapper>
          <div className="section bg-black">
            <HomeHeader />
            <div className="relative min-h-[calc(100vh-80px)]">
              <video
                className="mx-auto"
                width={1400}
                height={1200}
                src="https://gw.alipayobjects.com/v/huamei_ghirdt/afts/video/A*CeZ5TJsdJfMAAAAAAAAAAAAADuH-AQ"
                ref={videoRefs.banner}
                autoPlay
                muted
              />
              <div
                className="absolute w-full left-0 bottom-[180px] text-center mix-blend-difference transition-all duration-300 translate-y-8 opacity-0"
                ref={bannerActionRef}
              >
                <h2 className="mb-6 lg:mb-8 text-2xl leading-[32px] lg:text-5xl lg:leading-[64px] text-white">
                  {I18N.app.page.xiaoMaoMiZhuNi}
                </h2>
                <p className="mb-6 lg:mb-8 text-sm px-9 lg:text-xl text-white">
                  <Image
                    className="inline scale-85 origin-top-center"
                    style={{ filter: 'saturate(0)' }}
                    width={106}
                    height={20}
                    src="/images/logo-footer.svg"
                    alt="PeterCat"
                  />
                  {I18N.app.page.shiZhuanWeiSheQu}
                </p>
                <a
                  className="inline-block px-5 py-2 lg:px-8 lg:py-3 rounded-full border-2 border-white text-white text-sm lg:text-xl transition-transform hover:scale-105"
                  href="/market"
                >
                  {I18N.app.page.liJiChangShi}
                </a>
              </div>
            </div>
          </div>
          <div className="section bg-black group">
            <div className="h-screen border-box border-[20px] border-solid border-black bg-[#FEF4E1] rounded-[48px]">
              <div className="relative h-full flex flex-col items-center lg:justify-center lg:items-start max-w-[1600px] mx-auto p-8 pt-[146px] lg:py-8 lg:p-16 lg:pt-10 2xl:pt-[110px] opacity-0 transition-opacity group-[.active]:opacity-100">
                <Image
                  width={475}
                  height={95}
                  className="w-[98px] h-[28px] lg:w-[383px] lg:h-[110px] lg:ml-6 mb-3 lg:mb-6 opacity-0 transition-opacity group-[.fp-completely]:opacity-100"
                  src="/images/title_features.svg"
                  alt="Features"
                />
                <p className="lg:w-1/2 lg:ml-6 text-xs lg:text-xl text-[#27272A] opacity-0 transition-opacity group-[.fp-completely]:opacity-100">
                  {I18N.app.page.woMenTiGongDui}
                </p>
                <div
                  className="w-full relative mt-5 xl:mt-[72px] overflow-hidden"
                  ref={tableRef}
                >
                  <div className="lg:table table-fixed border-collapse">
                    <div className="table-row-group lg:table-row">
                      <div className="table-row border-1 border-[rgba(0,0,0,0.3)] lg:border-0 lg:table-cell relative px-5 xl:px-10 py-5 xl:py-[51.5px] lg:w-[calc(100%/3)] translate-y-8 opacity-0 transition-all group-[.fp-completely]:delay-300 group-[.fp-completely]:translate-y-0 group-[.fp-completely]:opacity-100">
                        <div className="table-cell p-2.5 text-center lg:p-0 lg:text-left lg:block">
                          <Image
                            width={72}
                            height={73}
                            src="/images/create.svg"
                            alt="create"
                            className="w-[20px] height-[20px] mx-auto lg:mx-0 lg:w-[72px] lg:h-[73px]"
                          />
                          <h3 className="mt-2 mb-0 lg:mt-6 lg:mb-3 font-medium text-sm lg:text-2xl 2xl:text-4xl text-black leading-[1.4]">
                            {I18N.app.page.duiHuaJiChuangZao}
                          </h3>
                          <p className="mt-1 text-xs lg:mt-3 lg:text-base 2xl:text-xl text-zinc-800">
                            {I18N.app.page.jinXuYaoGaoZhi}
                          </p>
                        </div>
                      </div>
                      <div className="table-row border-1 border-[rgba(0,0,0,0.3)] lg:border-0 lg:table-cell relative px-5 2xl:px-10 py-5 2xl:py-[51.5px] lg:w-[calc(100%/3)] translate-y-8 opacity-0 transition-all group-[.fp-completely]:delay-500 group-[.fp-completely]:translate-y-0 group-[.fp-completely]:opacity-100">
                        <div className="table-cell p-2.5 pt-4 text-center lg:p-0 lg:text-left lg:block">
                          <Image
                            width={72}
                            height={73}
                            src="/images/knowledge.svg"
                            alt="knowledge"
                            className="w-[20px] height-[20px] mx-auto lg:mx-0 lg:w-[72px] lg:h-[73px]"
                          />
                          <h3 className="mt-2 mb-0 lg:mt-6 lg:mb-3 font-medium text-sm lg:text-2xl 2xl:text-4xl text-black leading-[1.4]">
                            {I18N.app.page.zhiShiZiDongRu}
                          </h3>
                          <p className="mt-1 text-xs lg:mt-3 lg:text-base 2xl:text-xl text-zinc-800">
                            {I18N.app.page.jiQiRenChuangJian}
                          </p>
                        </div>
                      </div>
                      <div className="table-row border-1 border-[rgba(0,0,0,0.3)] lg:border-0 lg:table-cell relative px-5 2xl:px-10 py-5 2xl:py-[51.5px] lg:w-[calc(100%/3)] translate-y-8 opacity-0 transition-all group-[.fp-completely]:delay-700 group-[.fp-completely]:translate-y-0 group-[.fp-completely]:opacity-100">
                        <div className="table-cell p-2.5 text-center lg:p-0 lg:text-left lg:block">
                          <Image
                            width={72}
                            height={73}
                            src="/images/integrated.svg"
                            alt="integrated"
                            className="w-[20px] height-[20px] mx-auto lg:mx-0 lg:w-[72px] lg:h-[73px]"
                          />
                          <h3 className="mt-2 mb-0 lg:mt-6 lg:mb-3 font-medium text-sm lg:text-2xl 2xl:text-4xl text-black leading-[1.4]">
                            {I18N.app.page.duoPingTaiJiCheng}
                          </h3>
                          <p className="mt-1 text-xs lg:mt-3 lg:text-base 2xl:text-xl text-zinc-800">
                            {I18N.app.page.duoZhongJiChengFang}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="hidden lg:block absolute inset-0 pointer-events-none">
                    <div className="absolute inset-x-0 top-0 h-[1px] bg-[#b2ab9d] border-top" />
                    <div className="absolute inset-y-0 left-0 w-[1px] bg-[#b2ab9d] border-side" />
                    <div className="absolute inset-y-0 right-0 w-[1px] bg-[#b2ab9d] border-side" />
                    <div className="absolute inset-x-0 bottom-0 h-[1px] bg-[#b2ab9d] border-bottom" />
                    <div className="absolute top-0 left-[calc(100%/3)] w-[1px] h-full bg-[#b2ab9d] border-side" />
                    <div className="absolute top-0 left-[calc(100%*2/3)] w-[1px] h-full bg-[#b2ab9d] border-side" />
                  </div>
                </div>
                <Lottie
                  className="absolute w-[175px] lg:w-1/2 top-8 left-1/2 -translate-x-1/2 lg:translate-x-0 lg:top-[20%] lg:left-auto lg:right-5 pointer-events-none"
                  animationData={LottieOctopusCat}
                  autoPlay={false}
                  loop={false}
                  lottieRef={helixOctopusRef}
                />
              </div>
            </div>
          </div>
          <div className="section bg-black group relative">
            <div className="mx-auto min-h-screen lg:min-h-0 p-8 lg:p-[100px] lg:pb-8 opacity-0 transition-opacity group-[.active]:opacity-100 lg:grid grid-cols-2">
              <Lottie
                className="-mt-[80px] -translate-x-7 mx-auto w-[300px] lg:m-0 lg:w-auto lg:absolute lg:bottom-0 lg:-right-[200px] pointer-events-none opacity-0 group-[.fp-completely]:opacity-100"
                animationData={LottieLightningCat}
                autoPlay={false}
                loop={false}
                lottieRef={lightningCatRef}
              />
              <div>
                <div className="mx-auto lg:w-[650px] text-center lg:text-left">
                  <Image
                    className="hidden lg:block mb-9 relative scale-0 transition-transform duration-[166ms] group-[.fp-completely]:delay-[683ms] group-[.fp-completely]:scale-100"
                    width={361}
                    height={351}
                    src="/images/title_based.svg"
                    alt="Based on GPT4"
                  />
                  <Image
                    className="lg:hidden mx-auto mt-6 mb-3 scale-0 transition-transform duration-[166ms] group-[.fp-completely]:delay-[683ms] group-[.fp-completely]:scale-100"
                    width={121}
                    height={56}
                    src="/images/title_based_m.svg"
                    alt="Based on GPT4"
                  />
                  <p className="relative mb-6 lg:mb-[119px] leading-5 lg:leading-7 lg:ml-2 text-xs lg:text-xl text-[#FEF4E1] lg:w-[500px] mix-blend-difference scale-0 transition-transform duration-[83ms] group-[.fp-completely]:delay-[333ms] group-[.fp-completely]:scale-100">
                    {I18N.app.page.deYiYuQiangDa}
                  </p>
                  <div className="absolute left-8 right-8 lg:left-auto lg:right-auto z-10 bottom-10 inline-block text-[#FEF4E1] text-[15px] lg:text-base mix-blend-difference scale-0 transition-transform duration-[83ms] group-[.fp-completely]:delay-[83ms] group-[.fp-completely]:scale-100">
                    <Image
                      className="my-1 mx-auto lg:mx-0"
                      width={168}
                      height={24}
                      src="/images/title_powered.svg"
                      alt="Powered by"
                    />
                    <span className="inline-flex h-12 items-center mr-6">
                      <Image
                        width={48}
                        height={48}
                        className="mr-2"
                        src="/images/icon-open-ai.svg"
                        alt="OpenAI"
                      />
                      OpenAI
                    </span>
                    <span className="inline-flex h-12 items-center mr-6">
                      <Image
                        width={48}
                        height={48}
                        className="mr-2"
                        src="/images/icon-gemini.svg"
                        alt="Gemini"
                      />
                      Gemini
                    </span>
                    <span className="inline-flex h-12 items-center mr-6">
                      <Image
                        width={49}
                        height={48}
                        className="mr-2"
                        src="/images/icon-aws.svg"
                        alt="AWS"
                      />
                      AWS
                    </span>
                    <span className="inline-flex h-12 items-center mr-6">
                      <Image
                        width={48}
                        height={48}
                        className="mr-2"
                        src="/images/icon-supabase.svg"
                        alt="Supabase"
                      />
                      Supabase
                    </span>
                    <span className="inline-flex h-12 items-center">
                      <Image
                        width={48}
                        height={48}
                        className="mr-2"
                        src="/images/icon-tavily.svg"
                        alt="Tavily"
                      />
                      Tavily
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className="section lg:min-w-[900px] bg-[#FEF4E1] group *:relative"
            ref={showCaseRef}
          >
            <div className="absolute z-10 left-0 top-0 w-[150px] lg:w-1/2 h-screen flex justify-center items-end pointer-events-none">
              <Lottie
                animationData={LottieHelixCat}
                autoPlay={false}
                loop={false}
                lottieRef={helixCatRef}
              />
            </div>
            <div className="relative flex flex-col justify-center lg:max-w-[1400px] h-screen mx-auto px-4 lg:p-14 pt-8 lg:pt-[79px] opacity-0 transition-opacity group-[.active]:opacity-100">
              <Image
                width={279}
                height={70}
                className="mx-auto mb-4 lg:mb-0 lg:mx-0 w-[144px] h-[36px] lg:w-[279px] lg:h-[70px] lg:absolute z-10 top-[8.8%] left-1/2 lg:-translate-x-1/2 duration-[583ms] opacity-0 transition-opacity group-[.fp-completely]:delay-[1333ms] group-[.fp-completely]:opacity-100"
                src="/images/title_showcase.svg"
                alt="Showcase"
              />
              <div className="flex flex-col-reverse lg:flex-row justify-center items-start lg:pl-10">
                <div className="relative lg:-translate-y-[116px] mx-auto mt-5 lg:mt-0 lg:mx-0 lg:mr-12 p-1 lg:p-2">
                  <div className="w-full h-full absolute inset-0">
                    <div className="border-t border-[#B2AB9D] w-0 h-0 absolute top-0 left-0" />
                    <div className="border-b border-[#B2AB9D] w-0 h-0 absolute bottom-0 left-0" />
                    <div className="border-l border-[#B2AB9D] w-0 h-0 absolute top-0 left-0" />
                    <div className="border-r border-[#B2AB9D] w-0 h-0 absolute bottom-0 right-0" />
                  </div>
                  <div className="border-container relative">
                    <div className="w-full h-full absolute inset-0">
                      <div className="border-t border-[#B2AB9D] w-0 h-0 absolute top-0 right-0" />
                      <div className="border-b border-[#B2AB9D] w-0 h-0 absolute bottom-0 left-0" />
                      <div className="border-l border-[#B2AB9D] w-0 h-0 absolute top-0 left-0" />
                      <div className="border-r border-[#B2AB9D] w-0 h-0 absolute bottom-0 right-0" />
                    </div>
                    <video
                      className="max-w-[187px] lg:max-w-full lg:max-h-[60vh] lg:min-h-[383px] opacity-0 transition-opacity group-[.fp-completely]:delay-[1333ms] group-[.fp-completely]:opacity-100"
                      src={videos?.mobile}
                      ref={videoRefs.mobileCase}
                      autoPlay
                      loop
                      muted
                    />
                  </div>
                </div>
                <div className="relative p-1 lg:p-2 pt-4 lg:pt-9">
                  <div className="w-full h-full absolute inset-0">
                    <div className="border-t border-[#B2AB9D] w-0 h-0 absolute top-0 right-0" />
                    <div className="border-b border-[#B2AB9D] w-0 h-0 absolute bottom-0 left-0" />
                    <div className="border-l border-[#B2AB9D] w-0 h-0 absolute top-0 left-0" />
                    <div className="border-r border-[#B2AB9D] w-0 h-0 absolute bottom-0 right-0" />
                  </div>
                  <div className="border-container relative">
                    <div className="animated-border w-full h-full absolute inset-0">
                      <div className="border-t border-[#B2AB9D] w-0 h-0 absolute top-0 left-0" />
                      <div className="border-b border-[#B2AB9D] w-0 h-0 absolute bottom-0 left-0" />
                      <div className="border-l border-[#B2AB9D] w-0 h-0 absolute top-0 left-0" />
                      <div className="border-r border-[#B2AB9D] w-0 h-0 absolute bottom-0 right-0" />
                    </div>
                    <video
                      className="lg:max-h-[55vh] lg:min-h-[400px] opacity-0 transition-opacity group-[.fp-completely]:delay-[1333ms] group-[.fp-completely]:opacity-100"
                      src={videos?.pc}
                      ref={videoRefs.pcCase}
                      autoPlay
                      loop
                      muted
                    />
                  </div>
                  <span className="circle-border-animation absolute top-[5px] lg:top-2.5 left-1 lg:left-4 border rounded-full w-2 h-2 lg:w-4 lg:h-4" />
                  <span className="circle-border-animation absolute top-[5px] lg:top-2.5 left-5 lg:left-12 border rounded-full w-2 h-2 lg:w-4 lg:h-4" />
                  <span className="circle-border-animation absolute top-[5px] lg:top-2.5 left-9 lg:left-20 border rounded-full w-2 h-2 lg:w-4 lg:h-4" />
                </div>
              </div>
              <span className="block mt-4 lg:mt-0 mb-8 lg:mb-0 text-center lg:absolute z-10 bottom-[8.8%] left-1/2 lg:-translate-x-1/2 opacity-0 transition-opacity group-[.fp-completely]:delay-[1333ms] group-[.fp-completely]:opacity-100">
                <a
                  className="inline-block py-2 lg:py-3 px-5 lg:px-8 bg-gray-800 text-sm lg:text-xl text-white rounded-full transition-all hover:scale-105"
                  href="https://www.youtube.com/@petercat-ai"
                  target="_blank"
                >
                  {I18N.app.page.liaoJieGengDuo}
                </a>
              </span>
            </div>
            <HomeFooter />
          </div>
        </Fullpage.Wrapper>
      )}
    />
  );
}
