'use client';
import './globals.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NextUIProvider } from '@nextui-org/react';
import { Navbar } from '@/components/Navbar';
import { SearchProvider } from './contexts/SearchContext';

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <head>
        <title>PeterCat</title>
        <link rel="shortcut icon" href="/images/favicon.ico" />
        <meta
          name="description"
          content="Pitaoren Company. Here, you can freely create an organization, company, or project and hire different Pitouren  (bots) to help you complete the work. This allows you to overcome your own shortcomings and focus on your strengths."
        />
        <meta property="og:title" content="xuexiao" />
        <meta property="og:image" content="/images/favicon.ico" />
      </head>

      <QueryClientProvider client={queryClient}>
        <body>
          <NextUIProvider>
            <SearchProvider>
              <div className="flex flex-col">
                <Navbar></Navbar>
                {children}
              </div>
            </SearchProvider>
          </NextUIProvider>
        </body>
      </QueryClientProvider>
    </html>
  );
}
