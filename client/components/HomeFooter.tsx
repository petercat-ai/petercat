import React from 'react';
import Image from 'next/image';
import I18N from '@/app/utils/I18N';

const HomeFooter = () => {
  function Contributors() {
    return (
      <>
        <img
          className="mx-auto lg:mx-0 mb-4 my-1.5"
          src="/images/title_contributors.svg"
          alt="CONTRIBUTORS"
        />
        <div className="lg:max-w-[335px] grid grid-cols-2 gap-4">
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
      </>
    );
  }

  return (
    <footer className="bg-black">
      <div className="px-10  border-t  border-l-0 border-[#7F7A71]">
        <nav className=" grid grid-cols-2 gap-3 lg:flex justify-between items-center max-w-[1400px] mx-auto py-[21px]">
          <a
            className="text-base text-[#F4F4F5]/[0.6] transition-colors hover:text-[#F4F4F5]"
            href="https://github.com/petercat-ai/petercat"
            target="_blank"
          >
            {I18N.app.page.pETER}
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
            {I18N.app.page.maYiKaiYuan}
          </a>
          <a
            className="text-base text-[#F4F4F5]/[0.6] transition-colors hover:text-[#F4F4F5]"
            href="/policy"
            target="_blank"
          >
            {I18N.app.page.policy}
          </a>
          <a
            className="text-base text-[#F4F4F5]/[0.6] transition-colors hover:text-[#F4F4F5]"
            href="/agreement"
            target="_blank"
          >
            {I18N.app.page.agreement}
          </a>
        </nav>
      </div>
      <table className="w-full text-[#FEF4E1]">
        <tbody>
          <tr>
            <td className="w-1/2 border border-l-0 border-[#7F7A71] p-8 lg:px-10 lg:py-[51.5px]">
              <div className="lg:flex justify-end">
                <div className="relative flex-1 pb-[72px] lg:pb-0 max-w-[660px] text-center lg:text-left">
                  <a
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 lg:translate-x-0 lg:static lg:float-right whitespace-nowrap mt-4 py-3 px-8 text-xl text-[#FEF4E1] rounded-full border-2 border-white/[0.4] transition-all hover:border-white/[0.8] hover:scale-105"
                    href="https://github.com/petercat-ai/petercat/blob/main/README.md"
                    target="_blank"
                  >
                    {I18N.app.page.chaKanGengDuo}
                  </a>
                  <img
                    className="mx-auto lg:mx-0 mb-2 my-1.5"
                    src="/images/title_docs.svg"
                    alt="DOCS"
                  />
                  <p className="text-xl">{I18N.app.page.xiangMuXiangXiXin}</p>
                </div>
              </div>
            </td>
            <td
              className="hidden lg:table-cell border border-r-0 border-[#7F7A71] px-10 py-[51.5px] 2xl:bg-[url('/images/footer-contribution.png')] bg-contain bg-no-repeat pl-20 2xl:pl-[335px]"
              rowSpan={2}
            >
              <Contributors />
            </td>
          </tr>
          <tr>
            <td className="border border-l-0 border-[#7F7A71] p-8 lg:px-10 lg:py-[51.5px]">
              <div className="lg:flex justify-end">
                <div className="flex-1 max-w-[660px] text-center lg:text-left">
                  <img
                    className="mx-auto lg:mx-0 mb-2 my-1.5"
                    src="/images/title_contact.svg"
                    alt="CONTACT"
                  />
                  <a
                    className="text-xl text-[#FEF4E1] hover:underline"
                    href="mailto:petercat.assistant@gmail.com"
                  >
                    petercat.assistant@gmail.com
                  </a>
                </div>
              </div>
            </td>
          </tr>
          <tr className="lg:hidden">
            <td className="border border-l-0 border-[#7F7A71] pt-[290px] p-8 text-center bg-[url('/images/footer-contribution.png')] bg-[length:300px] bg-no-repeat bg-top">
              <Contributors />
            </td>
          </tr>
          <tr>
            <td
              className="border-t border-[#7F7A71] p-8 lg:px-10 lg:py-[51.5px]"
              colSpan={2}
            >
              <div className="lg:flex max-w-[1400px] mx-auto items-center">
                <p className="max-w-[560px] text-xl">
                  {I18N.app.page.woMenLaiZiMa}
                </p>
                <span className="block flex-1 my-12 lg:my-0 lg:mx-12 h-px border-t border-[#7F7A71]" />
                <Image
                  width={106}
                  height={20}
                  className="mx-auto lg:mx-0"
                  src="/images/logo-footer.svg"
                  alt="PeterCat"
                />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </footer>
  );
};

export default HomeFooter;
