"use client";
import { createUserAndSessionKernels } from "@/lib/zerodev-client";
import { transferOnUserBehalf } from "@/lib/zerodev-server";
import { getWalletClient } from "@wagmi/core";
import { saveSessionKey } from "app/actions/saveSessionKey";
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
  // console.log(locker);
  // const [isDeployingKernel, setIsDeployingKernel] = useState(false);
  const config = useConfig();

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
