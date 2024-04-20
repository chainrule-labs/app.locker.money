"use client";
import { getPortfolio } from "@/lib/moralis";
import { copyToClipboard } from "@/lib/utils";
import { createUserAndSessionKernels } from "@/lib/zerodev-client";
import { transferOnUserBehalf } from "@/lib/zerodev-server";
import { getWalletClient } from "@wagmi/core";
import { saveSessionKey } from "app/actions/saveSessionKey";
import Image from "next/image";
import { useEffect, useState } from "react";
import { PiCheckSquareOffset, PiCopy } from "react-icons/pi";
import { useConfig } from "wagmi";

export default function DashboardLockerSetup({
  transaction,
  locker,
}: {
  transaction: any;
  locker: any;
}) {
  const [copied, setCopied] = useState<boolean>(false);
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
    <div className="flex w-full flex-1 flex-col items-center justify-start p-4">
      <div className="mb-12 flex flex-col space-y-8">
        <h1 className="w-full text-4xl">Set up automatic savings</h1>
        <div className="mb-12 flex flex-col space-y-4 text-white">
          <span>
            The next time you receive ETH or ERC20, your Locker will
            automatically transfer funds based on the settings you choose below.
          </span>
        </div>
        <div className="flex w-full flex-row">
          <div className="flex w-1/5 flex-row">
            <input
              type="text"
              value={pctRemain}
              onChange={onPctUpdated}
              autoFocus
              className="w-4/5 rounded-md bg-zinc-100 p-3 text-4xl text-black"
            />
            <span className="w-1/5 text-4xl">%</span>
          </div>

          <span className="ml-10 w-4/5 text-left text-xl">
            Remains in your Locker for savings.
          </span>
        </div>

        <div className="flex w-full flex-row">
          <div className="flex w-1/5 flex-row">
            <span className="grow rounded-md bg-neutral-700 p-3 text-4xl">
              {100 - parseFloat(pctRemain)}
            </span>

            <span className="w-1/5 text-4xl">%</span>
          </div>

          <span className="ml-10 w-4/5 break-words text-xl">
            Forwarded to your EOA {locker.ownerAddress}.
          </span>
        </div>

        <div className="w-full space-y-1">
          {isDeployingKernel ? (
            <button
              className="w-full cursor-wait rounded-xl bg-[#3040EE] py-3 text-xl hover:bg-[#515EF1]"
              disabled
            >
              Setting Up Auto Save...
            </button>
          ) : (
            <button
              className="w-full rounded-xl bg-[#3040EE] py-3 text-xl hover:bg-[#515EF1]"
              onClick={onEnableAutomation}
            >
              Turn on Auto Save
            </button>
          )}
          <div className="text-center text-sm text-zinc-400">
            Staking and yield coming soon.
          </div>
        </div>
        <div className="space-y-8">
          <p className="mt-6 text-sm text-zinc-300">
            If you don&apos;t want to automate anything, you can continue
            receiving payments at your locker address. Automate when you&apos;re
            ready.
          </p>
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col items-start justify-center space-y-3">
              <span className="text-sm text-zinc-300">Your Locker:</span>
              <button
                className="flex items-center justify-center break-all text-left text-sm text-zinc-300 underline outline-none hover:text-[#515EF1]"
                onClick={() => copyToClipboard(locker.lockerAddress, setCopied)}
              >
                <code>{locker.lockerAddress}</code>
                {copied ? (
                  <PiCheckSquareOffset
                    className="ml-3 shrink-0 text-emerald-500"
                    size="20px"
                  />
                ) : (
                  <PiCopy className="ml-3 shrink-0" size="20px" />
                )}
              </button>
            </div>
            <div className="flex w-fit flex-col overflow-x-auto text-sm text-zinc-300">
              <table className="w-full text-left">
                <tbody>
                  <tr>
                    <th className="py-2 font-semibold">Supported Chains</th>
                  </tr>
                  <tr>
                    <td className="py-4">
                      <div className="flex items-center">
                        <div className="relative mr-3 size-4 shrink-0 items-center justify-center">
                          <Image src="/iconGnosis.svg" alt="gnosisChain" fill />
                        </div>
                        <span className="mr-3">Gnosis Chain</span>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4">
                      <div className="flex items-center">
                        <div className="relative mr-3 size-4 shrink-0 items-center justify-center">
                          <Image src="/iconBase.svg" alt="baseSepolia" fill />
                        </div>
                        <span className="mr-3">Base Sepolia</span>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4">
                      <div className="flex items-center">
                        <div className="relative mr-3 size-4 shrink-0 items-center justify-center">
                          <Image
                            src="/iconArbitrumOne.svg"
                            alt="arbSepolia"
                            fill
                          />
                        </div>
                        <span className="mr-3">Arbitrum Sepolia</span>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4">
                      <div className="flex items-center">
                        <div className="relative mr-3 size-4 shrink-0 items-center justify-center">
                          <Image src="/iconLinea.svg" alt="lineaSepolia" fill />
                        </div>
                        <span className="mr-3">Linea Sepolia</span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
