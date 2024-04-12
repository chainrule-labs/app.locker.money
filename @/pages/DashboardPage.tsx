"use client";

import { Input } from "@/components/ui/input";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";

type IOnboardState =
  | "onboard-wallet"
  | "onboard-savings-factor"
  | "onboard-complete";
export default function DashboardPage() {
  const { user } = useUser();
  const wallets = user?.web3Wallets;
  let defaultStep: IOnboardState = "onboard-wallet";
  if (!!user) {
    if (!!wallets?.length && wallets.length > 0) {
      defaultStep = "onboard-savings-factor";
    }
  }
  const [stepName, setStepName] = useState<IOnboardState>(defaultStep);
  const [savingsFactor, setSavingsFactor] = useState(0.2); // 0-1
  console.log(user);

  console.log(wallets);

  const address = wallets?.[0]?.web3Wallet;

  const setPctChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("setPctChanged");
    e.preventDefault();
    setSavingsFactor(parseFloat(e.target.value) / 100);
  };

  const spendPct = (1 - savingsFactor) * 100;
  const savingsPct = savingsFactor * 100;
  const stepOnboardSavingsFactor = (
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

  const stepOnboardWallet = <></>;

  // const step = stepNum === 1 ? step1 : step2;
  return (
    <div className="xs:grid xs:place-content-center h-[100svh] w-full">
      <div className="flex justify-center">
        <div className="min-w-1/3 flex flex-col space-y-12">
          {stepOnboardSavingsFactor}
        </div>
      </div>
    </div>
  );
}
