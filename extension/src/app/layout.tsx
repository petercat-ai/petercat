import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PeterCat',
  description: 'Create your own Q&A bot',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
