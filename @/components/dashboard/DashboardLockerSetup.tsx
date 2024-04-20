"use client";
import { getPortfolio } from "@/lib/moralis";
import { createUserAndSessionKernels } from "@/lib/zerodev-client";
import { transferOnUserBehalf } from "@/lib/zerodev-server";
import { getWalletClient } from "@wagmi/core";
import { saveSessionKey } from "app/actions/saveSessionKey";
import { useEffect, useState } from "react";
import { useConfig } from "wagmi";

export default function DashboardLockerSetup({
  transaction,
  locker,
}: {
  transaction: any;
  locker: any;
}) {
  const [pctRemain, setPctRemain] = useState<string>("20");

  const [lockerUsdValue, setLockerUsdValue] = useState<string>("$0.00");
  console.log(locker);
  const [isDeployingKernel, setIsDeployingKernel] = useState(false);
  const config = useConfig();

  const fetchPortfolio = async () => {
    if (!!locker?.lockerAddress) {
      console.log("fetching portfolio");
      console.log(locker);
      const { netWorthUsd } = await getPortfolio(locker?.lockerAddress);
      setLockerUsdValue(netWorthUsd);
    }
  };

  const onEnableAutomation = async () => {
    setIsDeployingKernel(true);
    const walletClient = await getWalletClient(config);
    // await createKernel(walletClient, chain!);
    const { serializedSessionKey } = await createUserAndSessionKernels(
      walletClient,
      locker.ownerAddress,
      transaction.transactions.chainId,
      locker.lockerAddress,
    );

    console.log("Serialized session key:", serializedSessionKey);

    await saveSessionKey(serializedSessionKey, locker.id, pctRemain);
    console.log("saved session key");
    console.log(transaction);
    // todo: not sure why transaction has shape {transactions, lockers}
    await transferOnUserBehalf(transaction.transactions);
    setIsDeployingKernel(false);
  };

  useEffect(() => {
    if (!!locker?.lockerAddress) fetchPortfolio();
  }, [locker?.lockerAddress]);

  const onPctUpdated = (e: any) => {
    // Don't accept numbers with more than 4 characters
    const pctStr = e.target.value;
    if (pctStr.length > 4) return;

    // Only accept numbers 0 - 100
    const pct = parseFloat(pctStr);
    if (!pct || pct < 0 || pct > 100) return;

    setPctRemain(e.target.value);
  };

  return (
    <>
      <div className="space-y-12">
        <div className="space-y-3">
          <p className="w-full text-xl font-bold">Set up automatic savings</p>

          <p>
            The next time you receive ETH or ERC20, your Locker will
            automatically transfer funds based on the settings you choose below.
          </p>
        </div>

        <div className="flex w-full flex-row">
          <div className="flex w-1/5 flex-row">
            <input
              type="text"
              value={pctRemain}
              onChange={onPctUpdated}
              autoFocus
              className="w-4/5 rounded-md bg-slate-100 p-3 text-4xl text-black"
            />
            <span className="w-1/5 text-4xl">%</span>
          </div>

          <span className="ml-10 w-4/5 text-left text-xl">
            Remains in your Locker for savings.
          </span>
        </div>

        <div className="flex w-full flex-row">
          <div className="flex w-1/5 flex-row">
            <span className="flex-grow rounded-md bg-neutral-700 p-3 text-4xl">
              {100 - parseFloat(pctRemain)}
            </span>

            <span className="w-1/5 text-4xl">%</span>
          </div>

          <span className="ml-10 w-4/5 break-words text-xl">
            Forwarded to your EOA {locker.ownerAddress}.
          </span>
        </div>

        <div className="space-y-1">
          {isDeployingKernel ? (
            <button
              className="w-full cursor-wait rounded-md bg-indigo-700 p-3 text-2xl"
              disabled
            >
              Setting Up Auto Save...
            </button>
          ) : (
            <button
              className="w-full rounded-md bg-indigo-400 p-3 text-2xl"
              onClick={onEnableAutomation}
            >
              Turn on Auto Save
            </button>
          )}
          <div className="flex w-full justify-center text-sm text-zinc-400">
            Staking and yield coming soon
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-white">
            If you don&apos;t want to automate anything, you can continue to
            deposit manually into your locker: {locker.lockerAddress}.
          </p>

          <p className="text-sm text-white">
            Arbitrum Sepolia, Base Sepolia, Linea Sepolia, and Gnosis mainnet
            supported.
          </p>
        </div>
      </div>
    </>
  );
}
