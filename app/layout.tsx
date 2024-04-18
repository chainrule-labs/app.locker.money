import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Head from "next/head";

import { cn } from "@/lib/utils";
import { Toaster } from "sonner";

import { ReactNode } from "react";
import GlobalProviders from "./GlobalProviders";
import Header from "./Header";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://app-locker-money.vercel.app"),
  title: process.env.NEXT_PUBLIC_APP_NAME!,
  description: process.env.NEXT_PUBLIC_APP_DESCRIPTION!,
  keywords: [
    "Open-Source",
    "Chain Rule",
    "DeFi",
    "Crypto",
    "Smart Contracts",
    "EVM",
    "Savings",
    "Acorns",
    "Payroll",
    "Automated",
    "Investments",
    "Staking",
    "Yield",
    "Arbitrum",
    "Linea",
    "Sepolia",
    "Gnosis",
    "Base",
  ],
  openGraph: {
    title: process.env.NEXT_PUBLIC_APP_NAME!,
    description: process.env.NEXT_PUBLIC_APP_DESCRIPTION!,
    url: "https://app-locker-money.vercel.app",
    type: "website",
    images: [
      {
        url: "https://app-locker-money.vercel.app/seoCard.png",
      },
    ],
  },
  twitter: {
    title: process.env.NEXT_PUBLIC_APP_NAME!,
    description: process.env.NEXT_PUBLIC_APP_DESCRIPTION!,
    card: "summary_large_image",
    images: [
      {
        url: "https://app-locker-money.vercel.app/seoCard.png",
      },
    ],
    site: "@locker_money",
  },
};

const inter = Inter({ weight: "700", subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#4c4fe4" />
        <meta name="theme-color" content="#101123" />
      </Head>
      <body
        className={cn(
          GeistSans.variable,
          GeistMono.variable,
          "font-sans",
          inter.className,
        )}
      >
        <Toaster />
        <GlobalProviders>
          <main className="relative mx-auto max-w-2xl">
            <Header />
            {children}
          </main>
        </GlobalProviders>
      </body>
    </html>
  );
}
