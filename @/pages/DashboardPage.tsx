"use client";

import { Input } from "@/components/ui/input";
import "@rainbow-me/rainbowkit/styles.css";
import { useState } from "react";

import { DEFAULT_SAVINGS_FACTOR } from "@/lib/constants";
import { createKernel } from "@/lib/zerodev";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { getWalletClient } from "@wagmi/core";
import { useAccount, useConfig } from "wagmi";

export default function DashboardPage() {
  const { openConnectModal } = useConnectModal();
  const config = useConfig();

  const { isConnected, address } = useAccount();
  // 0-1
  const [savingsFactor, setSavingsFactor] = useState(
    parseFloat(DEFAULT_SAVINGS_FACTOR),
  );

  const setPctChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    console.log("setPctChanged", e.target.value);
    const _savingsFactor = parseFloat(e.target.value) / 100;
    if (_savingsFactor <= 1 && _savingsFactor >= 0)
      setSavingsFactor(_savingsFactor);
  };

  const onCreateLocker = async () => {
    console.log("onCreateLocker", isConnected, address);
    if (!isConnected && openConnectModal) {
      openConnectModal();
    } else {
      const walletClient = await getWalletClient(config);
      createKernel(walletClient);
    }
  };

  const spendPct = (1 - savingsFactor) * 100;
  const savingsPct = savingsFactor * 100;

  const stepCreateLocker = (
    <>
      <span className="poppins w-full text-2xl font-bold">
        What percentage of incoming deposits do you want to save?
      </span>
      <div className="flex flex-row">
        <Input
          name="savings-pct"
          type="text"
          value={savingsPct}
          onChange={setPctChanged}
          className="h-36 w-36 text-8xl"
        />
        <span className="text-8xl">%</span>
      </div>

      <div>
        <p className="poppins w-full text-lg font-bold">How it works</p>
        <p className="text">1. Create Locker for your savings.</p>
        <p className="text">
          2. Deposit into Locker and automatically save {savingsPct}% every time
          you get paid.
        </p>
        <p className="text">
          3. The remaining {spendPct}% will be automatically forwarded to any
          address you want.
        </p>
      </div>
      <button
        className="w-full rounded-lg bg-blue-500 py-2 text-white"
        onClick={onCreateLocker}
      >
        Create Locker
      </button>
    </>
  );

  const step = stepCreateLocker;
  return (
    <div className="xs:grid xs:place-content-center h-[100svh] w-full">
      <div className="flex justify-center">
        <div className="min-w-1/3 flex flex-col space-y-12">{step}</div>
      </div>
    </div>
  );
}
