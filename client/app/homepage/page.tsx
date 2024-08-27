'use client';
import { useCallback, useEffect, useRef } from 'react';
import Image from 'next/image';
import Fullpage, { fullpageOptions } from '@fullpage/react-fullpage';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import LottieLightningCat from '@/app/assets/lightning_cat.json';
import LottieHelixCat from '@/app/assets/helix_cat.json';
import LottieOctopusCat from '@/app/assets/octopus_cat.json';
import GitHubIcon from '@/public/icons/GitHubIcon';

export default function Homepage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const bannerActionRef = useRef<HTMLDivElement>(null);
  const lightningCatRef = useRef<LottieRefCurrentProps>(null);
  const helixCatRef = useRef<LottieRefCurrentProps>(null);
  const helixOctopusRef = useRef<LottieRefCurrentProps>(null);
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
  const leaveHandler = useCallback<NonNullable<fullpageOptions['beforeLeave']>>(
    (_, dest) => {
      if (dest.isFirst) {
        videoRef.current!.play();
      } else if (dest.index === 1) {
        helixOctopusRef.current!.goToAndPlay(0);
      } else if (dest.index === 2) {
        lightningCatRef.current!.goToAndPlay(0);
      } else if (dest.index === 3) {
        helixCatRef.current!.goToAndPlay(0);
      }
    },
    [],
  );

  useEffect(() => {
    videoRef.current?.addEventListener('timeupdate', () => {
      if (videoRef.current!.currentTime > videoRef.current!.duration - 0.02) {
        videoRef.current!.currentTime = 5;
        videoRef.current!.play();
      }
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
            <header className="h-20 max-w-[1400px] mx-auto flex justify-between items-center">
              <span className="w-[216px]">
                <Image
                  src="/images/logo-inverse.svg"
                  alt="petercat"
                  className="h-8"
                />
              </span>
              <nav>
                <a href="/" className="text-[#f4f4f5] opacity-60">
                  皮套猫
                </a>
                <a href="/" className="ml-8 text-[#f4f4f5] opacity-60">
                  演示案例
                </a>
                <a href="/" className="ml-8 text-[#f4f4f5] opacity-60">
                  社区
                </a>
                <a href="/" className="ml-8 text-[#f4f4f5] opacity-60">
                  文档
                </a>
              </nav>
              <div>
                <a
                  href="/"
                  className="w-[100px] h-10 inline-block bg-white/[0.15] text-white rounded-full leading-10 text-center mr-4"
                >
                  0 stars
                </a>
                <a
                  href="/"
                  className="w-[100px] h-10 inline-block bg-white/[0.15] text-white rounded-full leading-10 text-center"
                >
                  登录
                </a>
              </div>
            </header>
            <div className="relative">
              <video
                className="mx-auto"
                width={1400}
                height={1200}
                src="https://mass-office.alipay.com/huamei_koqzbu/afts/file/TFhCS4dF8Y4AAAAAAAAAABAADnV5AQBr"
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
                  Peter
                  Cat（皮套猫）是专为社区维护者和开发者打造的智能答疑机器人解决方案。
                </p>
                <a
                  className="inline-block px-8 py-3 rounded-full border-2 border-white text-white text-xl"
                  href="/"
                >
                  立即尝试
                </a>
              </div>
            </div>
          </div>
          <div className="section bg-black">
            <div className="relative max-w-[1400px] mx-auto py-8 bg-[#FEF4E1] rounded-[48px] p-16 pt-[120px]">
              <h2 className="ml-6 mb-6 text-[100px] leading-none font-bold text-[#27272A]">
                Features
              </h2>
              <p className="ml-6 text-xl text-[#27272A] mr-[748px]">
                我们提供对话式答疑 Agent
                配置系统、自托管部署方案和便捷的一体化应用 SDK，让您能够为自己的
                GitHub
                仓库一键创建智能答疑机器人，并快速集成到各类官网或项目中，
                为社区提供更高效的技术支持生态。
              </p>
              <table className="w-full table-fixed border-collapse mt-[72px]">
                <tbody>
                  <tr>
                    <td className="relative px-10 py-[51.5px]">
                      <Image src="/images/create.svg" alt="create" />
                      <h3 className="mt-6 mb-3 font-medium text-4xl text-black leading-[1.4]">
                        对话即创造
                      </h3>
                      <p className="text-xl text-zinc-800">
                        仅需要告知你的仓库地址或名称，皮套猫即可自动完成创建机器人的全部流程
                      </p>
                    </td>
                    <td className="relative px-10 py-[51.5px]">
                      <Image src="/images/knowledge.svg" alt="knowledge" />
                      <h3 className="mt-6 mb-3 font-medium text-4xl text-black leading-[1.4]">
                        知识自动入库
                      </h3>
                      <p className="text-xl text-zinc-800">
                        机器人创建后，所有相关Github 文档和 issue
                        将自动入库，作为机器人的知识依据
                      </p>
                    </td>
                    <td className="relative px-10 py-[51.5px]">
                      <Image src="/images/integrated.svg" alt="integrated" />
                      <h3 className="mt-6 mb-3 font-medium text-4xl text-black leading-[1.4]">
                        多平台集成
                      </h3>
                      <p className="text-xl text-zinc-800">
                        多种集成方式自由选择，如对话应用 SDK 集成至官网，Github
                        APP一键安装至 Github 仓库等
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
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
              <h2 className="mb-6 text-[160px] leading-none font-bold text-[#FFA700] drop-shadow-[4px_8px_0_#000000]">
                <small>Based on</small>
                <br />
                GPT4
              </h2>
              <p className="mb-20 ml-2 text-xl text-[#FEF4E1] w-[500px] mix-blend-difference">
                得益于强大的底层能力，您可以将任意感兴趣的代码仓库转换为答疑机器人，或体验社区中其它机器人。它们不仅能推荐优质代码仓库，还能协助用户自动提交
                issue。
              </p>
              <div className="text-[#FEF4E1] text-base mix-blend-difference">
                <p className="text-xl font-bold text-[#FFA700]">Powered by</p>
                <span className="inline-flex h-12 items-center mr-6">
                  <Image
                    className="mr-2"
                    src="/images/icon-open-ai.svg"
                    alt="OpenAI"
                  />
                  OpenAI
                </span>
                <span className="inline-flex h-12 items-center mr-6">
                  <Image
                    className="mr-2"
                    src="/images/icon-aws.svg"
                    alt="AWS"
                  />
                  AWS
                </span>
                <span className="inline-flex h-12 items-center mr-6">
                  <Image
                    className="mr-2"
                    src="/images/icon-supabase.svg"
                    alt="Supabase"
                  />
                  Supabase
                </span>
                <span className="inline-flex h-12 items-center">
                  <Image
                    className="mr-2"
                    src="/images/icon-tavily.svg"
                    alt="Tavily"
                  />
                  Tavily
                </span>
              </div>
            </div>
          </div>
          <div className="section bg-[#FEF4E1]">
            <div className="relative max-w-[1400px] mx-auto p-14 pt-[166px]">
              <h2 className="mb-9 leading-none -indent-14 font-bold text-center text-[80px] text-[#3F3F46] drop-shadow-[4px_8px_0_#FECC6B]">
                Showcase
              </h2>
              <div className="flex justify-between items-start pl-10">
                <div className="relative -translate-y-[116px] border border-[#B2AB9D] p-2">
                  <div className="border border-[#B2AB9D] w-[248px] h-[383px]"></div>
                  <span className="absolute top-5 left-1/2 ml-[-32px] border border-[#B2AB9D] rounded-full w-16 h-[15px] bg-[#FEF4E1]"></span>
                </div>
                <div className="relative border border-[#B2AB9D] p-2 pt-9">
                  <div className="border border-[#B2AB9D] w-[844px] h-[436px]"></div>
                  <span className="absolute top-2.5 left-4 border border-[#B2AB9D] rounded-full w-4 h-4"></span>
                  <span className="absolute top-2.5 left-12 border border-[#B2AB9D] rounded-full w-4 h-4"></span>
                  <span className="absolute top-2.5 left-20 border border-[#B2AB9D] rounded-full w-4 h-4"></span>
                  <a
                    className="absolute bottom-[52px] left-1/2 -translate-x-1/2 py-3 px-8 bg-black text-xl text-white rounded-full"
                    href="/"
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
                <a className="text-base text-[#F4F4F5]/[0.6]" href="/">
                  petercat.chat
                </a>
                <a className="text-base text-[#F4F4F5]/[0.6]" href="/">
                  ant.design
                </a>
                <a className="text-base text-[#F4F4F5]/[0.6]" href="/">
                  makojs.dev
                </a>
                <a className="text-base text-[#F4F4F5]/[0.6]" href="/">
                  皮套猫社区
                </a>
                <a
                  className="flex items-center text-sm text-white py-[10px] px-6 rounded-full border-2 border-color-white/[0.4]"
                  href="/"
                >
                  <GitHubIcon className="inline scale-[0.66] -ml-1" />
                  登录
                </a>
              </nav>
              <table className="w-full text-[#FEF4E1]">
                <tbody>
                  <tr>
                    <td className="w-1/2 border border-l-0 border-[#7F7A71] px-10 py-[51.5px]">
                      <div className="flex justify-end">
                        <div className="flex-1 max-w-[660px]">
                          <a
                            className="float-right mt-4 py-3 px-8 text-xl text-[#FEF4E1] rounded-full border-2 border-white/[0.4]"
                            href="/"
                          >
                            查看更多
                          </a>
                          <h3 className="mb-2 text-3xl font-bold leading-[1.379]">
                            DOCS
                          </h3>
                          <p className="text-xl">项目详细信息请进文档查阅</p>
                        </div>
                      </div>
                    </td>
                    <td
                      className="border border-r-0 border-[#7F7A71] px-10 py-[51.5px] bg-[url('/images/footer-contribution.png')] bg-contain bg-no-repeat pl-[335px]"
                      rowSpan={2}
                    >
                      <h3 className="mb-4 text-3xl font-bold leading-[1.379]">
                        CONTRIBUTORS
                      </h3>
                      <div className="max-w-[335px] grid grid-cols-2 gap-4">
                        <a
                          className="text-xl text-[#FEF4E1] tracking-widest font-extralight"
                          href="/"
                        >
                          xingwanying
                        </a>
                        <a
                          className="text-xl text-[#FEF4E1] tracking-widest font-extralight"
                          href="/"
                        >
                          RaoHai
                        </a>
                        <a
                          className="text-xl text-[#FEF4E1] tracking-widest font-extralight"
                          href="/"
                        >
                          ch-liuzhide
                        </a>
                        <a
                          className="text-xl text-[#FEF4E1] tracking-widest font-extralight"
                          href="/"
                        >
                          PeachScript
                        </a>
                        <a
                          className="text-xl text-[#FEF4E1] tracking-widest font-extralight"
                          href="/"
                        >
                          golevkadesign
                        </a>
                        <a
                          className="text-xl text-[#FEF4E1] tracking-widest font-extralight"
                          href="/"
                        >
                          MadratJerry
                        </a>
                        <a
                          className="text-xl text-[#FEF4E1] tracking-widest font-extralight"
                          href="/"
                        >
                          AirBobby
                        </a>
                        <a
                          className="text-xl text-[#FEF4E1] tracking-widest font-extralight"
                          href="/"
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
                          <h3 className="mb-2 text-3xl font-bold leading-[1.379]">
                            CONTACT
                          </h3>
                          <a
                            className="text-xl text-[#FEF4E1]"
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
                        <Image src="/images/logo-footer.svg" alt="petercat" />
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
