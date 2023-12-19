'use client';
import './globals.css';
import { Public_Sans } from 'next/font/google';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { NextUIProvider } from '@nextui-org/react';
import { Navbar } from '@/components/Navbar';

const publicSans = Public_Sans({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Bot Combo</title>
        <link rel="shortcut icon" href="/images/favicon.ico" />
        <meta
          name="description"
          content="Pitaoren Company. Here, you can freely create an organization, company, or project and hire different Pitouren  (bots) to help you complete the work. This allows you to overcome your own shortcomings and focus on your strengths."
        />
        <meta property="og:title" content="xuexiao" />
        <meta property="og:image" content="/images/favicon.ico" />
      </head>
      <UserProvider>
        <body className="bg-[url('/images/bg.svg')] bg-top bg-no-repeat">
          <NextUIProvider>
            <div className="flex flex-col h-[100vh]">
              <Navbar></Navbar>
              {children}
            </div>
          </NextUIProvider>
        </body>
      </UserProvider>
    </html>
  );
}
