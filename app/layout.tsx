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
  title: process.env.NEXT_PUBLIC_APP_NAME!,
  description: process.env.NEXT_PUBLIC_APP_DESCRIPTION!,
};

const inter = Inter({ weight: "700", subsets: ["latin"] });

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
          <main className="relative mx-auto max-w-2xl">
            <Header />
            {children}
          </main>
        </GlobalProviders>
      </body>
    </html>
  );
}
