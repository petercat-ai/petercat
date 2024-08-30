'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NextUIProvider } from '@nextui-org/react';
import { Navbar } from '@/components/Navbar';
import { SearchProvider } from './contexts/SearchContext';
import { BotProvider } from './contexts/BotContext';

import 'petercat-lui/style';
import './globals.css';
import { usePathname } from 'next/navigation';

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
        <meta name="description" content="Peter Cat -- GitHub Assistant" />
        <meta property="og:title" content="Peter Cat" />
        <meta property="og:image" content="/images/logo.png" />
      </head>

      <QueryClientProvider client={queryClient}>
        <body>
          <NextUIProvider>
            <SearchProvider>
              <BotProvider>
                {pathname === '/' ? (
                  children
                ) : (
                  <div className="flex flex-col">
                    <Navbar></Navbar>
                    <div className="pb-[40px]">{children}</div>
                  </div>
                )}
              </BotProvider>
            </SearchProvider>
          </NextUIProvider>
        </body>
      </QueryClientProvider>
    </html>
  );
}
