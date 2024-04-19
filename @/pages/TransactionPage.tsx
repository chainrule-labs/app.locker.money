"use client";

import { PATHS } from "@/lib/paths";
import { getTx } from "app/actions/getTx";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";

const TransactionPage = () => {
  const searchParams = useSearchParams();
  const txHash = searchParams.get("txHash");
  const [transaction, setTransaction] = useState<any>(null);
  const [chainName, setChainName] = useState<string>("");
  const router = useRouter();

  const supportedChains: { [key: number]: string } = {
    84532: "Base Sepolia",
    59141: "Linea Sepolia",
    421614: "Arbitrum Sepolia",
    100: "Gnosis Chain",
  };

  const onContinue = () => {
    // If locker is NOT deployed, route to DashboardSetup
    // If locker is deployed, route to DashboardPortfolio

    // For now, assume locker is not deployed...
    router.push(PATHS.HOME);
  };

  const getTxDetails = async () => {
    const tx = await getTx(txHash as string);
    const chain = supportedChains[tx?.chainId];
    setTransaction(tx);
    setChainName(chain);
  };

  useEffect(() => {
    getTxDetails();
  }, []);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-4 py-10">
      <span className="mb-12 text-3xl">Great News!</span>
      <FaCheckCircle className="mb-12 text-emerald-500" size="50px" />
      {transaction && (
        <span className="mb-12 text-lg font-normal">
          You received{" "}
          <span className="text-xl font-bold">
            {transaction.amount} {transaction.tokenSymbol}
          </span>{" "}
          on
          {chainName}!
        </span>
      )}
      <button
        className="w-full rounded-lg bg-[#4A22EC] py-2 text-white hover:bg-[#4C4FE4]"
        onClick={() => onContinue()}
      >
        Continue
      </button>
    </div>
  );
};

export default TransactionPage;

// Test URL
// http://localhost:3000/tx?txHash=0x479db1d8314f81c8a3b2098c6047814f147a5f158c959bff00783542b32c1fce
