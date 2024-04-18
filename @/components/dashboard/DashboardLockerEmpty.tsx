"use client";
import { ExternalLinkIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { parseEther } from "viem";
import {
  BaseError,
  useAccount,
  useSendTransaction,
  useWaitForTransactionReceipt,
} from "wagmi";

export default function DashboardLockerEmpty({
  lockerAddress,
}: {
  lockerAddress: `0x${string}`;
}) {
  const [amountInput, setAmountInput] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const { chain } = useAccount();

  const reset = () => {
    setErrorMessage("");
  };

  const {
    data: hash,
    error,
    isPending,
    sendTransaction,
  } = useSendTransaction();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const onDeposit = async () => {
    setErrorMessage("");
    sendTransaction({
      to: lockerAddress,
      value: parseEther("0.001"),
    });
  };

  const handleAmountChange = (event: React.FormEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    let amountString = target.validity.valid ? target.value : amountInput;
    const tokenDecimals = chain?.nativeCurrency.decimals || 18;

    if (amountString === "") {
    } else if (amountString !== ".") {
      if (amountString[0] === ".") {
        amountString = `0${amountString}`;
      }

      const components = amountString.split(".");
      const decimals = components[1];

      if (decimals && decimals.length > tokenDecimals) {
        setErrorMessage("Too many decimal places.");
      } else {
        setErrorMessage("");
      }
    }

    setAmountInput(amountString);
  };

  useEffect(() => {
    if (isConfirmed) {
      reset();
    }
  }, [isConfirmed]);

  useEffect(() => {
    if (error && !JSON.stringify(error).includes("User rejected")) {
      setErrorMessage((error as BaseError).shortMessage || error.message);
    }
  }, [error]);

  return (
    <div className="xs:grid xs:place-content-center h-full w-full p-4">
      <div className="mb-12 flex flex-col space-y-4">
        <h1 className="font- w-full text-3xl font-normal">
          Your Locker is Empty
        </h1>
        <div className="flex flex-col space-y-4 font-normal text-zinc-300">
          <span>
            <span className="font-semibold text-white">Locker Address: </span>{" "}
            <code>{lockerAddress}</code>
          </span>
          <span>
            <span className="font-semibold text-white">Supported Chains: </span>{" "}
            Arbitrum Sepolia, Base Sepolia, Linea Sepolia, and Gnosis Mainnet.
          </span>
        </div>
      </div>
      <div className="mb-12 flex flex-col space-y-4 font-normal text-white">
        <span>
          Tell your employer or clients to pay you at your Locker address.
        </span>
        <span>
          You can also deposit yourself by transferring funds to your Locker
          address from another account.
        </span>
      </div>
      <div className="flex flex-col">
        <span className="mb-1 mr-2 font-semibold text-white">
          {chain?.nativeCurrency.symbol} Amount:
        </span>
        <input
          className="rounded-md bg-zinc-700 p-2 font-normal"
          type="text"
          pattern="[0-9]*\.?[0-9]*"
          inputMode="decimal"
          placeholder="0.00"
          onWheel={(event) => (event.target as HTMLInputElement).blur()}
          autoComplete="off"
          value={amountInput}
          onInput={(event) => handleAmountChange(event)}
        />
        {errorMessage && (
          <span className="mt-8 self-center font-normal text-red-500">
            {errorMessage}
          </span>
        )}
        {isConfirmed && (
          <>
            <span className="mt-8 self-center font-normal text-emerald-500">
              Successful Deposit!
            </span>
            <a
              className="mt-8 flex items-center space-x-2 self-center font-normal text-[#4A22EC] hover:text-[#4C4FE4] hover:underline"
              href={`${chain?.blockExplorers?.default.url}/tx/${hash}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>View on Explorer</span>
              <ExternalLinkIcon />
            </a>
          </>
        )}
      </div>
      <button
        className={`${!amountInput || isPending || isConfirming ? "cursor-not-allowed" : "cursor-pointer"} mt-12 flex h-10 w-full items-center justify-center rounded-lg bg-[#4A22EC] py-2 text-white hover:bg-[#4C4FE4]`}
        onClick={onDeposit}
        disabled={!amountInput || isPending || isConfirming}
      >
        {isPending || isConfirming ? "Confirming..." : "Deposit"}
      </button>
    </div>
  );
}

// Check if locker has been funded every 5 seconds
// If funded, display message saying the locker is fundedq
// If funded, display button to go to dashboard
// After manual deposit, show button to go to dashboard
