import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Quotation Checker - Auditing SaaS",
  description: "AI-Powered Construction Quotation Auditing Tool",
};

import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';
import { Suspense } from 'react';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <Suspense fallback={<aside className="fixed left-0 top-0 bottom-0 w-[232px] bg-[var(--surface)] border-r border-[var(--border)]" />}>
          <Sidebar />
        </Suspense>
        <main className="ml-[232px] flex-1 flex flex-col min-h-screen px-7 pb-12 transition-all duration-200">
          <Topbar />
          {children}
        </main>
      </body>
    </html>
  );
}
