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

    await saveSessionKey(serializedSessionKey, locker.id);
    console.log("saved session key");
    console.log(transaction);
    // todo: not sure why transaction has shape {transactions, lockers}
    await transferOnUserBehalf(transaction.transactions);
    setIsDeployingKernel(false);
  };

  useEffect(() => {
    if (!!locker?.lockerAddress) fetchPortfolio();
  }, [locker?.lockerAddress]);

  return (
    <>
      <div className="space-y-12">
        <div className="space-y-3">
          <p className="w-full text-xl font-bold">Set up automatic savings</p>

          <p>
            Congratulations, you funded your Locker with {lockerUsdValue}. To
            take it to the next level, automate your money by enabling Auto
            Save.
          </p>
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
