import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

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
  icons: {
    icon: [
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        url: "/favicon-32x32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        url: "/favicon-16x16.png",
      },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        url: "/apple-touch-icon.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "192x192",
        url: "/android-chrome-192x192.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "256x256",
        url: "/android-chrome-256x256.png",
      },
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#4c4fe4",
      },
    ],
  },
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

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
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
          <main
            className={`${inter.className} mx-auto flex min-h-screen w-full min-w-[230px] max-w-2xl flex-col items-center`}
          >
            <Header />
            {children}
            {/* Commenitng out footer, since children are ignoring flex-1 property */}
            {/* <Footer /> */}
          </main>
        </GlobalProviders>
      </body>
    </html>
  );
}
