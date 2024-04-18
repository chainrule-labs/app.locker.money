"use client";
import { createKernel } from "@/lib/zerodev";
import { getWalletClient } from "@wagmi/core";
import { useConfig } from "wagmi";

export default function DashboardLockerSetup({
  lockerUsdValue,
  transaction,
  locker,
}: {
  lockerUsdValue: string;
  transaction: any;
  locker: any;
}) {
  // const [isDeployingKernel, setIsDeployingKernel] = useState(false);
  const config = useConfig();

  const onEnableAutomation = async () => {
    const walletClient = await getWalletClient(config);
    // await createKernel(walletClient, chain!);
    await createKernel(
      walletClient,
      locker.ownerAddress,
      transaction,
      locker.lockerAddress,
    );
  };

  // fetch lockerUsdValue here using getPortfolio

  return (
    <>
      <div className="space-y-12">
        <p className="poppins w-full text-3xl font-bold">
          Set up automated savings
        </p>

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
          If you don't want to automate anything, you can continue to deposit
          manually into your locker: {locker.lockerAddress}.
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
