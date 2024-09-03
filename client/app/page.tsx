'use client';
import { RefObject, useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Fullpage, { fullpageOptions } from '@fullpage/react-fullpage';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import LottieLightningCat from '@/app/assets/lightning_cat.json';
import LottieHelixCat from '@/app/assets/helix_cat.json';
import LottieOctopusCat from '@/app/assets/octopus_cat.json';
import GitHubIcon from '@/public/icons/GitHubIcon';
import Profile from '@/components/User';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '@/components/LangSwitcher';

export default function Homepage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const bannerActionRef = useRef<HTMLDivElement>(null);
  const lightningCatRef = useRef<LottieRefCurrentProps>(null);
  const helixCatRef = useRef<LottieRefCurrentProps>(null);
  const helixOctopusRef = useRef<LottieRefCurrentProps>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const showCaseRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation('common');

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
          videoRef.current?.play();
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
            updateClasses(false, true);
            break;
          default:
            updateClasses(false, false);
            break;
        }
      }
    },
    [],
  );
  const [stars, setStars] = useState(0);

  useEffect(() => {
    videoRef.current?.addEventListener('timeupdate', () => {
      if (videoRef.current!.currentTime > videoRef.current!.duration - 0.02) {
        videoRef.current!.currentTime = 5;
        videoRef.current!.play();
      }
    });

    fetch('https://api.github.com/repos/petercat-ai/petercat')
      .then((res) => res.json())
      .then((data) => {
        setStars(data.stargazers_count || 0);
      });
  }, []);

  return (
    <Fullpage
      onScrollOverflow={scrollHandler}
      beforeLeave={leaveHandler}
      credits={{}}
      render={() => (
        <Fullpage.Wrapper>
          <div className="section bg-black">
            <header className="h-20 max-w-[1400px] mx-auto flex items-center">
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
                  href="/"
                  className="ml-8 text-[#f4f4f5] opacity-60 transition-opacity hover:opacity-90"
                >
                  {t('homepage.nav.home')}
                </a>
                <a
                  href="/market"
                  className="ml-8 text-[#f4f4f5] opacity-60 transition-opacity hover:opacity-90"
                >
                  {t('homepage.nav.market')}
                </a>
                <a
                  href="https://github.com/petercat-ai/petercat/blob/main/README.zh-CN.md"
                  className="ml-8 text-[#f4f4f5] opacity-60 transition-opacity hover:opacity-90"
                  target="_blank"
                >
                  {t('homepage.nav.doc')}
                </a>
              </nav>
              <div className="flex-1 flex justify-end">
                <LanguageSwitcher />
                <a
                  href="https://github.com/petercat-ai/petercat"
                  className="min-w-[100px] px-4 h-10 inline-block bg-white/[0.15] transition-colors hover:bg-white/[0.3] text-white rounded-full leading-10 text-center mr-4"
                  target="_blank"
                >
                  <GitHubIcon className="inline scale-75 -translate-y-0.5" />
                  {stars} stars
                </a>
                <Profile />
              </div>
            </header>
            <div className="relative">
              <video
                className="mx-auto"
                width={1400}
                height={1200}
                src="https://gw.alipayobjects.com/v/huamei_ghirdt/afts/video/A*CeZ5TJsdJfMAAAAAAAAAAAAADuH-AQ"
                ref={videoRef}
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
                  是专为社区维护者和开发者打造的智能答疑机器人解决方案。
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
          <div className="section bg-black">
            <div className="relative max-w-[1400px] mx-auto py-8 bg-[#FEF4E1] rounded-[48px] p-16 pt-[120px]">
              <Image
                width={475}
                height={95}
                className="ml-6 mb-6"
                src="/images/title_features.svg"
                alt="Features"
              />
              <p className="ml-6 text-xl text-[#27272A] mr-[748px]">
                我们提供对话式答疑 Agent
                配置系统、自托管部署方案和便捷的一体化应用 SDK，让您能够为自己的
                GitHub
                仓库一键创建智能答疑机器人，并快速集成到各类官网或项目中，
                为社区提供更高效的技术支持生态。
              </p>
              <div
                className="w-full relative mt-[72px] overflow-hidden"
                ref={tableRef}
              >
                <table className="table-fixed border-collapse ">
                  <tbody>
                    <tr>
                      <td className="relative px-10 py-[51.5px] w-[calc(100%/3)]">
                        <Image
                          width={72}
                          height={73}
                          src="/images/create.svg"
                          alt="create"
                        />
                        <h3 className="mt-6 mb-3 font-medium text-4xl text-black leading-[1.4]">
                          对话即创造
                        </h3>
                        <p className="text-xl text-zinc-800">
                          仅需要告知你的仓库地址或名称，Peter Cat
                          即可自动完成创建机器人的全部流程
                        </p>
                      </td>
                      <td className="relative px-10 py-[51.5px] w-[calc(100%/3)]">
                        <Image
                          width={72}
                          height={73}
                          src="/images/knowledge.svg"
                          alt="knowledge"
                        />
                        <h3 className="mt-6 mb-3 font-medium text-4xl text-black leading-[1.4]">
                          知识自动入库
                        </h3>
                        <p className="text-xl text-zinc-800">
                          机器人创建后，所有相关Github 文档和 issue
                          将自动入库，作为机器人的知识依据
                        </p>
                      </td>
                      <td className="relative px-10 py-[51.5px] w-[calc(100%/3)]">
                        <Image
                          width={72}
                          height={73}
                          src="/images/integrated.svg"
                          alt="integrated"
                        />
                        <h3 className="mt-6 mb-3 font-medium text-4xl text-black leading-[1.4]">
                          多平台集成
                        </h3>
                        <p className="text-xl text-zinc-800">
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
                className="absolute bottom-[320px] right-10"
                animationData={LottieOctopusCat}
                autoPlay={false}
                loop={false}
                lottieRef={helixOctopusRef}
              />
            </div>
          </div>
          <div className="section bg-black">
            <div className="max-w-[1400px] mx-auto p-[84px] pb-8">
              <Lottie
                className="absolute bottom-0 right-0"
                animationData={LottieLightningCat}
                autoPlay={false}
                loop={false}
                lottieRef={lightningCatRef}
              />
              <Image
                className="mb-6 relative"
                width={542}
                height={251}
                src="/images/title_based.svg"
                alt="Based on GPT4"
              />
              <p className="mb-20 ml-2 text-xl text-[#FEF4E1] w-[500px] mix-blend-difference">
                得益于强大的底层能力，您可以将任意感兴趣的代码仓库转换为答疑机器人，或体验社区中其它机器人。它们不仅能推荐优质代码仓库，还能协助用户自动提交
                issue。
              </p>
              <div className="text-[#FEF4E1] text-base mix-blend-difference">
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
          <div className="section bg-[#FEF4E1] " ref={showCaseRef}>
            <div className="relative max-w-[1400px] mx-auto p-14 pt-[166px]">
              <Image
                className="mb-9 mx-auto"
                width={463}
                height={90}
                src="/images/title_showcase.svg"
                alt="Showcase"
              />
              <div className="flex justify-between items-start pl-10">
                <div className="relative -translate-y-[116px] p-2">
                  <div className="w-full h-full absolute inset-0">
                    <div className="border-t border-[#B2AB9D] w-0 h-0 absolute top-0 left-0" />
                    <div className="border-b border-[#B2AB9D] w-0 h-0 absolute bottom-0 left-0" />
                    <div className="border-l border-[#B2AB9D] w-0 h-0 absolute top-0 left-0" />
                    <div className="border-r border-[#B2AB9D] w-0 h-0 absolute bottom-0 right-0" />
                  </div>
                  <div className="border-container relative w-[248px] h-[383px]">
                    <div className="w-full h-full absolute inset-0">
                      <div className="border-t border-[#B2AB9D] w-0 h-0 absolute top-0 right-0" />
                      <div className="border-b border-[#B2AB9D] w-0 h-0 absolute bottom-0 left-0" />
                      <div className="border-l border-[#B2AB9D] w-0 h-0 absolute top-0 left-0" />
                      <div className="border-r border-[#B2AB9D] w-0 h-0 absolute bottom-0 right-0" />
                    </div>
                  </div>
                  <span className="absolute top-5 left-1/2 ml-[-32px] border border-[#B2AB9D] rounded-full w-16 h-[15px] bg-[#FEF4E1]"></span>
                </div>
                <div className="relative p-2 pt-9">
                  <div className="w-full h-full absolute inset-0">
                    <div className="border-t border-[#B2AB9D] w-0 h-0 absolute top-0 right-0" />
                    <div className="border-b border-[#B2AB9D] w-0 h-0 absolute bottom-0 left-0" />
                    <div className="border-l border-[#B2AB9D] w-0 h-0 absolute top-0 left-0" />
                    <div className="border-r border-[#B2AB9D] w-0 h-0 absolute bottom-0 right-0" />
                  </div>
                  <div className="border-container relative w-[844px] h-[436px]">
                    <div className="animated-border w-full h-full absolute inset-0">
                      <div className="border-t border-[#B2AB9D] w-0 h-0 absolute top-0 left-0" />
                      <div className="border-b border-[#B2AB9D] w-0 h-0 absolute bottom-0 left-0" />
                      <div className="border-l border-[#B2AB9D] w-0 h-0 absolute top-0 left-0" />
                      <div className="border-r border-[#B2AB9D] w-0 h-0 absolute bottom-0 right-0" />
                    </div>
                  </div>
                  <span className="circle-border-animation absolute top-2.5 left-4 border border-[#B2AB9D] rounded-full w-4 h-4" />
                  <span className="circle-border-animation absolute top-2.5 left-12 border border-[#B2AB9D] rounded-full w-4 h-4" />
                  <span className="circle-border-animation absolute top-2.5 left-20 border border-[#B2AB9D] rounded-full w-4 h-4" />
                  <a
                    className="absolute bottom-[52px] left-1/2 -translate-x-1/2 py-3 px-8 bg-black text-xl text-white rounded-full transition-transform hover:scale-105"
                    href="/"
                    target="_blank"
                  >
                    了解更多
                  </a>
                </div>
              </div>
              <Lottie
                className="absolute bottom-0 left-0"
                animationData={LottieHelixCat}
                autoPlay={false}
                loop={false}
                lottieRef={helixCatRef}
              />
            </div>
            <footer className="bg-black">
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
              <table className="w-full text-[#FEF4E1]">
                <tbody>
                  <tr>
                    <td className="w-1/2 border border-l-0 border-[#7F7A71] px-10 py-[51.5px]">
                      <div className="flex justify-end">
                        <div className="flex-1 max-w-[660px]">
                          <a
                            className="float-right mt-4 py-3 px-8 text-xl text-[#FEF4E1] rounded-full border-2 border-white/[0.4] transition-colors hover:border-white/[0.8]"
                            href="/"
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
                      className="border border-r-0 border-[#7F7A71] px-10 py-[51.5px] bg-[url('/images/footer-contribution.png')] bg-contain bg-no-repeat pl-[335px]"
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
                        <p className="max-w-[400px] text-xl">
                          我们来自蚂蚁集团的 Ant Design
                          团队，致力于创造美而实用的产品，AI
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
