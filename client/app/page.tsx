'use client';
import { RefObject, useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Fullpage, { fullpageOptions } from '@fullpage/react-fullpage';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import LottieLightningCat from '@/app/assets/lightning_cat.json';
import LottieHelixCat from '@/app/assets/helix_cat.json';
import LottieOctopusCat from '@/app/assets/octopus_cat.json';
import GitHubIcon from '@/public/icons/GitHubIcon';

// play same video util refresh page
const PC_EXAMPLE_VIDEO = [
  'https://gw.alipayobjects.com/v/huamei_ghirdt/afts/video/A*7lc3QKRnuYAAAAAAAAAAAAAADuH-AQ',
  'https://gw.alipayobjects.com/v/huamei_ghirdt/afts/video/A*TmIsT7SUWPsAAAAAAAAAAAAADuH-AQ',
  'https://gw.alipayobjects.com/v/huamei_ghirdt/afts/video/A*UaYESbe_mJMAAAAAAAAAAAAADuH-AQ',
];
const MOBILE_EXAMPLE_VIDEO = [
  'https://gw.alipayobjects.com/v/huamei_ghirdt/afts/video/A*izMfSbJJXLoAAAAAAAAAAAAADuH-AQ',
  'https://gw.alipayobjects.com/v/huamei_ghirdt/afts/video/A*tuaNRbG-5q4AAAAAAAAAAAAADuH-AQ',
  'https://gw.alipayobjects.com/v/huamei_ghirdt/afts/video/A*sxvhTafMlIoAAAAAAAAAAAAADuH-AQ',
  'https://gw.alipayobjects.com/v/huamei_ghirdt/afts/video/A*wFfqQ6XBd2EAAAAAAAAAAAAADuH-AQ',
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
  const [stars, setStars] = useState(0);

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

    fetch('https://api.github.com/repos/petercat-ai/petercat')
      .then((res) => res.json())
      .then((data) => {
        setStars(data.stargazers_count || 0);
      });

    setVideos({
      pc: PC_EXAMPLE_VIDEO[Math.floor(Math.random() * 3)],
      mobile: MOBILE_EXAMPLE_VIDEO[Math.floor(Math.random() * 4)],
    });

    return () => {
      videoRefs.banner.current?.removeEventListener(
        'timeupdate',
        videoUpdateHandler,
      );
      clearTimeout(videoRefs.pcCase.current!._timer);
    };
  }, []);

  return (
    <Fullpage
      onScrollOverflow={scrollHandler}
      beforeLeave={leaveHandler}
      afterLoad={enterHandler}
      credits={{}}
      render={() => (
        <Fullpage.Wrapper>
          <div className="section min-w-[900px] bg-black">
            <header className="h-20 px-10 mx-auto flex items-center">
              <span className="flex-1">
                <Image
                  width={114}
                  height={32}
                  src="/images/logo-inverse.svg"
                  alt="petercat"
                  className="h-8"
                />
              </span>
              <nav>
                <a
                  href="https://www.youtube.com/@petercat-ai"
                  className="text-[#f4f4f5] opacity-60 transition-opacity hover:opacity-90"
                  target="_blank"
                >
                  演示案例
                </a>
                <a
                  href="/market"
                  className="ml-8 text-[#f4f4f5] opacity-60 transition-opacity hover:opacity-90"
                >
                  工作台
                </a>
                <a
                  href="https://github.com/petercat-ai/petercat/blob/main/README.md"
                  className="ml-8 text-[#f4f4f5] opacity-60 transition-opacity hover:opacity-90"
                  target="_blank"
                >
                  文档
                </a>
              </nav>
              <div className="flex-1 flex justify-end">
                <a
                  href="https://github.com/petercat-ai/petercat"
                  className="min-w-[100px] px-4 h-10 inline-block bg-white/[0.15] transition-colors hover:bg-white/[0.3] text-white rounded-full leading-10 text-center mr-4"
                  target="_blank"
                >
                  <GitHubIcon className="inline scale-75 -translate-y-0.5" />
                  {stars} stars
                </a>
              </div>
            </header>
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
                <h2 className="mb-8 text-5xl leading-[64px] text-white">
                  小猫咪助你征服 Github
                </h2>
                <p className="mb-8 text-xl text-white">
                  <Image
                    className="inline scale-85 origin-top-right"
                    style={{ filter: 'saturate(0)' }}
                    width={106}
                    height={20}
                    src="/images/logo-footer.svg"
                    alt="Peter Cat"
                  />
                  是专为社区维护者和开发者打造的智能答疑机器人解决方案
                </p>
                <a
                  className="inline-block px-8 py-3 rounded-full border-2 border-white text-white text-xl transition-transform hover:scale-105"
                  href="/market"
                >
                  立即尝试
                </a>
              </div>
            </div>
          </div>
          <div className="section min-w-[900px] bg-black group">
            <div className="h-screen border-box border-[20px] border-solid border-black bg-[#FEF4E1] rounded-[48px]">
              <div className="relative h-full flex flex-col justify-center max-w-[1600px] mx-auto py-8 p-16 pt-10 xl:pt-[110px] opacity-0 transition-opacity group-[.active]:opacity-100">
                <Image
                  width={475}
                  height={95}
                  className="ml-6 mb-6 opacity-0 transition-opacity group-[.fp-completely]:opacity-100"
                  src="/images/title_features.svg"
                  alt="Features"
                />
                <p className="w-1/2 ml-6 text-xl text-[#27272A] opacity-0 transition-opacity group-[.fp-completely]:opacity-100">
                  我们提供对话式答疑 Agent
                  配置系统、自托管部署方案和便捷的一体化应用
                  SDK，让您能够为自己的 GitHub
                  仓库一键创建智能答疑机器人，并快速集成到各类官网或项目中，
                  为社区提供更高效的技术支持生态。
                </p>
                <div
                  className="w-full relative mt-5 xl:mt-[72px] overflow-hidden"
                  ref={tableRef}
                >
                  <table className="table-fixed border-collapse ">
                    <tbody>
                      <tr>
                        <td className="relative px-5 xl:px-10 py-5 xl:py-[51.5px] w-[calc(100%/3)] translate-y-8 opacity-0 transition-all group-[.fp-completely]:delay-300 group-[.fp-completely]:translate-y-0 group-[.fp-completely]:opacity-100">
                          <Image
                            width={72}
                            height={73}
                            src="/images/create.svg"
                            alt="create"
                          />
                          <h3 className="mt-6 mb-3 font-medium text-2xl xl:text-4xl text-black leading-[1.4]">
                            对话即创造
                          </h3>
                          <p className="text-base xl:text-xl text-zinc-800">
                            仅需要告知你的仓库地址或名称，Peter Cat
                            即可自动完成创建机器人的全部流程
                          </p>
                        </td>
                        <td className="relative px-5 xl:px-10 py-5 xl:py-[51.5px] w-[calc(100%/3)] translate-y-8 opacity-0 transition-all group-[.fp-completely]:delay-500 group-[.fp-completely]:translate-y-0 group-[.fp-completely]:opacity-100">
                          <Image
                            width={72}
                            height={73}
                            src="/images/knowledge.svg"
                            alt="knowledge"
                          />
                          <h3 className="mt-6 mb-3 font-medium text-2xl xl:text-4xl text-black leading-[1.4]">
                            知识自动入库
                          </h3>
                          <p className="text-base xl:text-xl text-zinc-800">
                            机器人创建后，所有相关Github 文档和 issue
                            将自动入库，作为机器人的知识依据
                          </p>
                        </td>
                        <td className="relative px-5 xl:px-10 py-5 xl:py-[51.5px] w-[calc(100%/3)] translate-y-8 opacity-0 transition-all group-[.fp-completely]:delay-700 group-[.fp-completely]:translate-y-0 group-[.fp-completely]:opacity-100">
                          <Image
                            width={72}
                            height={73}
                            src="/images/integrated.svg"
                            alt="integrated"
                          />
                          <h3 className="mt-6 mb-3 font-medium text-2xl xl:text-4xl text-black leading-[1.4]">
                            多平台集成
                          </h3>
                          <p className="text-base xl:text-xl text-zinc-800">
                            多种集成方式自由选择，如对话应用 SDK
                            集成至官网，Github APP一键安装至 Github 仓库等
                          </p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-x-0 top-0 h-[1px] bg-[#b2ab9d] border-top" />
                    <div className="absolute inset-y-0 left-0 w-[1px] bg-[#b2ab9d] border-side" />
                    <div className="absolute inset-y-0 right-0 w-[1px] bg-[#b2ab9d] border-side" />
                    <div className="absolute inset-x-0 bottom-0 h-[1px] bg-[#b2ab9d] border-bottom" />
                    <div className="absolute top-0 left-[calc(100%/3)] w-[1px] h-full bg-[#b2ab9d] border-side" />
                    <div className="absolute top-0 left-[calc(100%*2/3)] w-[1px] h-full bg-[#b2ab9d] border-side" />
                  </div>
                </div>
                <Lottie
                  className="absolute w-1/2 top-[20%] right-5 pointer-events-none"
                  animationData={LottieOctopusCat}
                  autoPlay={false}
                  loop={false}
                  lottieRef={helixOctopusRef}
                />
              </div>
            </div>
          </div>
          <div className="section min-w-[900px] bg-black group relative">
            <div className="mx-auto p-[100px] pb-8 opacity-0 transition-opacity group-[.active]:opacity-100 grid grid-cols-2">
              <Lottie
                className="absolute bottom-0 -right-[200px] pointer-events-none opacity-0 group-[.fp-completely]:opacity-100"
                animationData={LottieLightningCat}
                autoPlay={false}
                loop={false}
                lottieRef={lightningCatRef}
              />
              <div>
                <div className="mx-auto w-[650px]">
                  <Image
                    className="mb-9 relative scale-0 transition-transform duration-[166ms] group-[.fp-completely]:delay-[683ms] group-[.fp-completely]:scale-100"
                    width={542}
                    height={251}
                    src="/images/title_based.svg"
                    alt="Based on GPT4"
                  />
                  <p className="relative mb-[119px] ml-2 text-xl text-[#FEF4E1] w-[500px] mix-blend-difference scale-0 transition-transform duration-[83ms] group-[.fp-completely]:delay-[333ms] group-[.fp-completely]:scale-100">
                    得益于强大的底层能力，您可以将任意感兴趣的代码仓库转换为答疑机器人，或体验社区中其它机器人。它们不仅能推荐优质代码仓库，还能协助用户自动提交
                    issue。
                  </p>
                  <div className="absolute z-10 bottom-10 inline-block text-[#FEF4E1] text-base mix-blend-difference scale-0 transition-transform duration-[83ms] group-[.fp-completely]:delay-[83ms] group-[.fp-completely]:scale-100">
                    <Image
                      className="my-1"
                      width={147}
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
            className="section min-w-[900px] bg-[#FEF4E1] group *:relative"
            ref={showCaseRef}
          >
            <div className="absolute z-10 left-0 top-0 w-1/2 h-screen flex justify-center items-end pointer-events-none">
              <Lottie
                animationData={LottieHelixCat}
                autoPlay={false}
                loop={false}
                lottieRef={helixCatRef}
              />
            </div>
            <div className="relative flex flex-col justify-center max-w-[1400px] h-screen mx-auto p-14 pt-[79px] opacity-0 transition-opacity group-[.active]:opacity-100">
              <Image
                className="absolute z-10 top-[8.8%] left-1/2 -translate-x-1/2 duration-[583ms] opacity-0 transition-opacity group-[.fp-completely]:delay-[1333ms] group-[.fp-completely]:opacity-100"
                width={463}
                height={90}
                src="/images/title_showcase.svg"
                alt="Showcase"
              />
              <div className="flex justify-center items-start pl-10">
                <div className="relative -translate-y-[116px] mr-12 p-2">
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
                      className="max-h-[60vh] min-h-[383px] opacity-0 transition-opacity group-[.fp-completely]:delay-[1333ms] group-[.fp-completely]:opacity-100"
                      src={videos?.mobile}
                      ref={videoRefs.mobileCase}
                      autoPlay
                      loop
                      muted
                    />
                  </div>
                </div>
                <div className="relative p-2 pt-9">
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
                      className="max-h-[55vh] min-h-[400px] opacity-0 transition-opacity group-[.fp-completely]:delay-[1333ms] group-[.fp-completely]:opacity-100"
                      src={videos?.pc}
                      ref={videoRefs.pcCase}
                      autoPlay
                      loop
                      muted
                    />
                  </div>
                  <span className="circle-border-animation absolute top-2.5 left-4 border rounded-full w-4 h-4" />
                  <span className="circle-border-animation absolute top-2.5 left-12 border rounded-full w-4 h-4" />
                  <span className="circle-border-animation absolute top-2.5 left-20 border rounded-full w-4 h-4" />
                </div>
              </div>
              <span className="absolute z-10 bottom-[8.8%] left-1/2 -translate-x-1/2 opacity-0 transition-opacity group-[.fp-completely]:delay-[1333ms] group-[.fp-completely]:opacity-100">
                <a
                  className="inline-block py-3 px-8 bg-gray-800 text-xl text-white rounded-full transition-all hover:scale-105"
                  href="https://www.youtube.com/@petercat-ai"
                  target="_blank"
                >
                  了解更多
                </a>
              </span>
            </div>
            <footer className="bg-black">
              <div className="px-10">
                <nav className="flex justify-between items-center max-w-[1400px] mx-auto py-[21px]">
                  <a
                    className="text-base text-[#F4F4F5]/[0.6] transition-colors hover:text-[#F4F4F5]"
                    href="https://github.com/petercat-ai/petercat"
                    target="_blank"
                  >
                    Peter Cat 社区
                  </a>
                  <a
                    className="text-base text-[#F4F4F5]/[0.6] transition-colors hover:text-[#F4F4F5]"
                    href="https://ant-design.antgroup.com/index-cn"
                    target="_blank"
                  >
                    Ant Design
                  </a>
                  <a
                    className="text-base text-[#F4F4F5]/[0.6] transition-colors hover:text-[#F4F4F5]"
                    href="https://makojs.dev/"
                    target="_blank"
                  >
                    Mako
                  </a>
                  <a
                    className="text-base text-[#F4F4F5]/[0.6] transition-colors hover:text-[#F4F4F5]"
                    href="https://opensource.antgroup.com"
                    target="_blank"
                  >
                    蚂蚁开源
                  </a>
                </nav>
              </div>
              <table className="w-full text-[#FEF4E1]">
                <tbody>
                  <tr>
                    <td className="w-1/2 border border-l-0 border-[#7F7A71] px-10 py-[51.5px]">
                      <div className="flex justify-end">
                        <div className="flex-1 max-w-[660px]">
                          <a
                            className="float-right mt-4 py-3 px-8 text-xl text-[#FEF4E1] rounded-full border-2 border-white/[0.4] transition-all hover:border-white/[0.8] hover:scale-105"
                            href="https://github.com/petercat-ai/petercat/blob/main/README.md"
                            target="_blank"
                          >
                            查看更多
                          </a>
                          <img
                            className="mb-2 my-1.5"
                            src="/images/title_docs.svg"
                            alt="DOCS"
                          />
                          <p className="text-xl">项目详细信息请进文档查阅</p>
                        </div>
                      </div>
                    </td>
                    <td
                      className="border border-r-0 border-[#7F7A71] px-10 py-[51.5px] xl:bg-[url('/images/footer-contribution.png')] bg-contain bg-no-repeat pl-20 xl:pl-[335px]"
                      rowSpan={2}
                    >
                      <img
                        className="mb-4 my-1.5"
                        src="/images/title_contributors.svg"
                        alt="CONTRIBUTORS"
                      />
                      <div className="max-w-[335px] grid grid-cols-2 gap-4">
                        <a
                          className="text-xl text-[#FEF4E1] tracking-widest font-extralight hover:underline"
                          href="https://github.com/xingwanying"
                          target="_blank"
                        >
                          xingwanying
                        </a>
                        <a
                          className="text-xl text-[#FEF4E1] tracking-widest font-extralight hover:underline"
                          href="https://github.com/RaoHai"
                          target="_blank"
                        >
                          RaoHai
                        </a>
                        <a
                          className="text-xl text-[#FEF4E1] tracking-widest font-extralight hover:underline"
                          href="https://github.com/ch-liuzhide"
                          target="_blank"
                        >
                          ch-liuzhide
                        </a>
                        <a
                          className="text-xl text-[#FEF4E1] tracking-widest font-extralight hover:underline"
                          href="https://github.com/PeachScript"
                          target="_blank"
                        >
                          PeachScript
                        </a>
                        <a
                          className="text-xl text-[#FEF4E1] tracking-widest font-extralight hover:underline"
                          href="https://github.com/golevkadesign"
                          target="_blank"
                        >
                          golevkadesign
                        </a>
                        <a
                          className="text-xl text-[#FEF4E1] tracking-widest font-extralight hover:underline"
                          href="https://github.com/MadratJerry"
                          target="_blank"
                        >
                          MadratJerry
                        </a>
                        <a
                          className="text-xl text-[#FEF4E1] tracking-widest font-extralight hover:underline"
                          href="https://github.com/AirBobby"
                          target="_blank"
                        >
                          AirBobby
                        </a>
                        <a
                          className="text-xl text-[#FEF4E1] tracking-widest font-extralight hover:underline"
                          href="https://github.com/alichengyue"
                          target="_blank"
                        >
                          alichengyue
                        </a>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-l-0 border-[#7F7A71] px-10 py-[51.5px]">
                      <div className="flex justify-end">
                        <div className="flex-1 max-w-[660px]">
                          <img
                            className="mb-2 my-1.5"
                            src="/images/title_contact.svg"
                            alt="CONTACT"
                          />
                          <a
                            className="text-xl text-[#FEF4E1] hover:underline"
                            href="mailto:antd.antgroup@gmail.com"
                          >
                            antd.antgroup@gmail.com
                          </a>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td
                      className="border-t border-[#7F7A71] px-10 py-[51.5px]"
                      colSpan={2}
                    >
                      <div className="flex max-w-[1400px] mx-auto items-center">
                        <p className="max-w-[560px] text-xl">
                          我们来自蚂蚁集团支付宝体验技术部，致力于创造美而实用的产品，AI
                          只是手段，为你的工作提供更多愉悦的价值才是我们的唯一目标。
                        </p>
                        <span className="flex-1 mx-12 h-px border-t border-[#7F7A71]" />
                        <Image
                          width={106}
                          height={20}
                          src="/images/logo-footer.svg"
                          alt="Peter Cat"
                        />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </footer>
          </div>
        </Fullpage.Wrapper>
      )}
    />
  );
}
