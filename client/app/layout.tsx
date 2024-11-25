'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NextUIProvider } from '@nextui-org/react';
import { Navbar } from '@/components/Navbar';
import { GlobalProvider } from './contexts/GlobalContext';
import { BotProvider } from './contexts/BotContext';
import { usePathname } from 'next/navigation';
import '@petercatai/assistant/style';
import './globals.css';

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <html lang="zh-CN">
      <head>
        <title>PeterCat</title>
        <link rel="shortcut icon" href="/images/favicon.ico" />
        <meta name="description" content="PeterCat -- GitHub Assistant" />
        <meta property="og:title" content="PeterCat" />
        <meta property="og:image" content="/images/logo.png" />
      </head>

      <QueryClientProvider client={queryClient}>
        <body>
          <NextUIProvider>
            <GlobalProvider>
              <BotProvider>
                {pathname === '/' ||
                pathname === '/policy' ||
                pathname === '/agreement' ? (
                  children
                ) : (
                  <div className="flex flex-col bg-[#F3F4F6]">
                    <Navbar></Navbar>
                    <div className="pb-[40px]">{children}</div>
                  </div>
                )}
              </BotProvider>
            </GlobalProvider>
          </NextUIProvider>
        </body>
      </QueryClientProvider>
    </html>
  );
}
