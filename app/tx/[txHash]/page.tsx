"use client";
import { PATHS } from "@/lib/paths";
import { getTx } from "app/actions/getTx";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";

export default function Transaction({
  params,
}: {
  params: { txHash: string };
}) {
  const router = useRouter();
  const [transaction, setTransaction] = useState<any>(null);
  const [chainName, setChainName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const supportedChains: { [key: number]: string } = {
    11155111: "Sepolia",
    84532: "Base Sepolia",
    59141: "Linea Sepolia",
    421614: "Arbitrum Sepolia",
    100: "Gnosis Chain",
  };

  const handleContinue = () => {
    // If locker is NOT deployed, route to DashboardSetup
    // If locker is deployed, route to DashboardLockerPortfolio

    // For now, assume locker is not deployed...
    router.push(PATHS.HOME);
  };

  const getTxDetails = async () => {
    try {
      const tx = await getTx(params.txHash);
      const chain = supportedChains[Number(tx?.chainId)];
      console.log("chainId", tx?.chainId);
      setTransaction(tx);
      setChainName(chain);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getTxDetails();
  }, [params.txHash]);

  return (
    <div className="flex size-full flex-col items-center justify-center p-4 py-10">
      {isLoading ? (
        <div className="flex size-full items-center justify-center p-4">
          <span>Loading...</span>
        </div>
      ) : transaction ? (
        <div className="flex flex-col justify-center space-y-12 text-center">
          <span className="text-xl">Great News!</span>
          <FaCheckCircle
            className="flex self-center justify-self-center text-emerald-500 placeholder:place-self-center"
            size="50px"
          />

          <div>
            <span className="text-3xl font-normal">
              You received{" "}
              <strong>
                {transaction.amount} {transaction.tokenSymbol}
              </strong>{" "}
            </span>
            <p className="text-center">on {chainName}!</p>
          </div>

          <button
            className="w-full rounded-lg bg-[#3040EE] py-2 text-lg text-white hover:bg-[#515EF1]"
            onClick={() => handleContinue()}
          >
            Continue
          </button>
        </div>
      ) : (
        <span className="mb-12 text-2xl">Transaction Not Found</span>
      )}
    </div>
  );
}

// Test URL
// http://localhost:3000/tx/0x479db1d8314f81c8a3b2098c6047814f147a5f158c959bff00783542b32c1fce
