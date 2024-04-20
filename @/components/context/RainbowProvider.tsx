"use client";

import {
  RainbowKitProvider,
  darkTheme,
  getDefaultConfig,
} from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import process from "process";
import {
  arbitrumSepolia,
  baseSepolia,
  gnosis,
  lineaSepolia,
} from "viem/chains";
import { WagmiProvider } from "wagmi";

const queryClient = new QueryClient();

const config = getDefaultConfig({
  appName: "Locker Beta",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_ID!,
  chains: [baseSepolia, arbitrumSepolia, lineaSepolia, gnosis],
  ssr: true, // If your dApp uses server side rendering (SSR)
});

export function RainbowProvider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme({ accentColor: "#4C4FE4" })}>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
