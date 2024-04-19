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
  const [lockerUsdValue, setLockerUsdValue] = useState<string>("$0.00");
  // console.log(locker);
  // const [isDeployingKernel, setIsDeployingKernel] = useState(false);
  const config = useConfig();

  const fetchPortfolio = async () => {
    if (!!locker && transaction) {
      const { netWorthUsd } = await getPortfolio(locker?.lockerAddress);
      setLockerUsdValue(netWorthUsd);
    }
  };

  const onEnableAutomation = async () => {
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
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  return (
    <>
      <div className="space-y-12">
        <p className="w-full text-3xl font-bold">Set up automated savings</p>

        <div>
          <p>Congratulations, you funded your Locker with {lockerUsdValue}.</p>
          <p>
            To take it to the next level, automate your money moves by setting
            up a saving rule.
          </p>
        </div>

        <div>
          <button
            className="rounded-md bg-indigo-400 p-3"
            onClick={onEnableAutomation}
          >
            Automate savings
          </button>
        </div>

        <p className="text-sm text-zinc-400">
          If you don&apos;t want to automate anything, you can continue to
          deposit manually into your locker: {locker.lockerAddress}.
        </p>

        <p className="text-sm text-zinc-400">
          Arbitrum Sepolia, Base Sepolia, Linea Sepolia, and Gnosis mainnet
          supported.
        </p>

        <p className="text-sm text-zinc-400">
          Staking and yield options coming soon.
        </p>
      </div>
    </>
  );
}
