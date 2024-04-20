"use client";
import { copyToClipboard } from "@/lib/utils";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";
import { PiCheckSquareOffset, PiCopy } from "react-icons/pi";

export default function DashboardLockerEmpty({
  lockerAddress,
}: {
  lockerAddress: `0x${string}`;
}) {
  const [copied, setCopied] = useState<boolean>(false);

  return (
    <div className="flex w-full flex-1 flex-col items-center justify-start p-4">
      <div className="mb-12 flex flex-col space-y-8">
        <h1 className="w-full text-4xl">Your locker is empty</h1>
        <div className="mb-12 flex flex-col space-y-4 text-white">
          <span>
            Tell your employer, hackathon organizer, or clients to pay you at
            your Locker address below.
          </span>
          <span>
            You can also deposit yourself by transferring funds to your Locker
            address from another account.
          </span>
          <span>
            Send native ETH or any ERC-20 token to your Locker to start saving.
          </span>
        </div>
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col items-center justify-center space-y-3">
            <span className="self-center text-4xl">Fund Your Locker</span>
            <div className="mx-auto my-8 max-w-xs rounded-lg bg-white p-3 shadow-lg">
              <QRCodeSVG
                className="self-center"
                value={lockerAddress}
                size={200}
              />
            </div>
            <button
              className="flex items-center justify-center break-all text-left text-zinc-300 underline outline-none hover:text-[#515EF1]"
              onClick={() => copyToClipboard(lockerAddress, setCopied)}
            >
              <code>{lockerAddress}</code>
              {copied ? (
                <PiCheckSquareOffset
                  className="ml-3 shrink-0 text-emerald-500"
                  size="25px"
                />
              ) : (
                <PiCopy className="ml-3 shrink-0" size="25px" />
              )}
            </button>
          </div>
          <div className="flex w-fit flex-col self-center overflow-x-auto text-white">
            <table className="w-full text-left">
              <tbody>
                <tr>
                  <th className="py-2 text-center text-xl font-semibold">
                    Supported Chains
                  </th>
                </tr>
                <tr>
                  <td className="py-4">
                    <div className="flex items-center">
                      <div className="relative mr-3 size-7 shrink-0 items-center justify-center">
                        <Image src="/iconGnosis.svg" alt="gnosisChain" fill />
                      </div>
                      <span className="mr-3">Gnosis Chain</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="py-4">
                    <div className="flex items-center">
                      <div className="relative mr-3 size-7 shrink-0 items-center justify-center">
                        <Image src="/iconBase.svg" alt="baseSepolia" fill />
                      </div>
                      <span className="mr-3">Base Sepolia</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="py-4">
                    <div className="flex items-center">
                      <div className="relative mr-3 size-7 shrink-0 items-center justify-center">
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
                      <div className="relative mr-3 size-7 shrink-0 items-center justify-center">
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
  );
}

// ***************************************************************************** //
// *************** CODE TO DEPOSIT THROUGH UI (DO NOT DELETE) *************** //
// ***************************************************************************** //

// import { useEffect, useState } from "react";
// import { parseEther } from "viem";
// import {
//   BaseError,
//   useAccount,
//   useSendTransaction,
//   useWaitForTransactionReceipt,
// } from "wagmi";

// const [amountInput, setAmountInput] = useState<string>("");
// const [errorMessage, setErrorMessage] = useState<string>("");

// const { chain } = useAccount();

// const reset = () => {
//   setErrorMessage("");
// };

// const {
//   data: hash,
//   error,
//   isPending,
//   sendTransaction,
// } = useSendTransaction();

// const { isLoading: isConfirming, isSuccess: isConfirmed } =
//   useWaitForTransactionReceipt({
//     hash,
//   });

// const onDeposit = async () => {
//   setErrorMessage("");
//   sendTransaction({
//     to: lockerAddress,
//     value: parseEther("0.001"),
//   });
// };

// const handleAmountChange = (event: React.FormEvent<HTMLInputElement>) => {
//   const target = event.target as HTMLInputElement;
//   let amountString = target.validity.valid ? target.value : amountInput;
//   const tokenDecimals = chain?.nativeCurrency.decimals || 18;

//   if (amountString === "") {
//   } else if (amountString !== ".") {
//     if (amountString[0] === ".") {
//       amountString = `0${amountString}`;
//     }

//     const components = amountString.split(".");
//     const decimals = components[1];

//     if (decimals && decimals.length > tokenDecimals) {
//       setErrorMessage("Too many decimal places.");
//     } else {
//       setErrorMessage("");
//     }
//   }

//   setAmountInput(amountString);
// };

// useEffect(() => {
//   if (isConfirmed) {
//     reset();
//   }
// }, [isConfirmed]);

// useEffect(() => {
//   if (error && !JSON.stringify(error).includes("User rejected")) {
//     setErrorMessage((error as BaseError).shortMessage || error.message);
//   }
// }, [error]);
/*
    <div className="flex flex-col">
        <span className="mb-1 mr-2 font-semibold text-white">
          {chain?.nativeCurrency.symbol} Amount:
        </span>
        <input
          className="rounded-md bg-zinc-700 p-2 "
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
          <span className="mt-8 self-center  text-red-500">
            {errorMessage}
          </span>
        )}
        {isConfirmed && (
          <>
            <span className="mt-8 self-center  text-emerald-500">
              Successful Deposit!
            </span>
            <a
              className="mt-8 flex items-center space-x-2 self-center  text-[#3040EE] hover:text-[#515EF1] hover:underline"
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
        className={`${!amountInput || isPending || isConfirming ? "cursor-not-allowed" : "cursor-pointer"} mt-12 flex h-10 w-full items-center justify-center rounded-lg bg-[#3040EE] py-2 text-white hover:bg-[#515EF1]`}
        onClick={onDeposit}
        disabled={!amountInput || isPending || isConfirming}
      >
        {isPending || isConfirming ? "Confirming..." : "Deposit"}
      </button>
   */
