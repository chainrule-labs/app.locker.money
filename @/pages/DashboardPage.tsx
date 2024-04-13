"use client";

import { Input } from "@/components/ui/input";
import "@rainbow-me/rainbowkit/styles.css";
import { useState } from "react";

import { ILocker } from "@/lib/types";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { arbitrum, base, mainnet, optimism, polygon } from "wagmi/chains";

const queryClient = new QueryClient();

const config = getDefaultConfig({
  appName: "Locker Beta",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_ID!,
  chains: [mainnet, polygon, optimism, arbitrum, base],
  ssr: true, // If your dApp uses server side rendering (SSR)
});

type IDashboardPageProps = {
  locker: ILocker | null;
};

export default function DashboardPage() {
  // if locker exists
  // retrieve savings ID and cumulative balance
  // const [stepName, setStepName] = useState<IOnboardState>(defaultStep);
  const [savingsFactor, setSavingsFactor] = useState(0.2); // 0-1
  // console.log(user);

  // console.log(wallets);

  // const address = wallets?.[0]?.web3Wallet;

  const setPctChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("setPctChanged");
    e.preventDefault();
    setSavingsFactor(parseFloat(e.target.value) / 100);
  };

  const address = "0x1234...";
  const spendPct = (1 - savingsFactor) * 100;
  const savingsPct = savingsFactor * 100;

  const stepOnboardWallet = <></>;

  const step1HowItWorks = (
    <>
      <span className="poppins w-full text-4xl font-bold">How it works</span>

      <span className="text-lg">1. Create Locker for your savings.</span>
      <span className="text-lg">
        2. Deposit into Locker to route money anywhere and auto-save.
      </span>
      <button className="w-full rounded-lg bg-blue-500 py-2 text-white">
        I understand
      </button>
    </>
  );

  const step2SavingsFactor = (
    <>
      <span className="poppins w-full text-2xl font-bold">
        What percentage of incoming deposits do you want to save?
      </span>
      <Input name="savings-pct" value={savingsPct} onChange={setPctChanged} />
      <span>
        The remaining {spendPct}% will be automatically forwarded to {address}.
      </span>
      <button
        className="w-full rounded-lg bg-blue-500 py-2 text-white"
        onClick={() => console.log("Locker created")}
      >
        Create Locker
      </button>
    </>
  );

  const step = step1HowItWorks;
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <div className="xs:grid xs:place-content-center h-[100svh] w-full">
            <div className="flex justify-center">
              <div className="min-w-1/3 flex flex-col space-y-12">{step}</div>
            </div>
          </div>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
