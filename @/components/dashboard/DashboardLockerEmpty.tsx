"use client";
import { copyToClipboard } from "@/lib/utils";
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
    <div className="xs:grid xs:place-content-center h-full w-full p-4">
      <div className="mb-12 flex flex-col space-y-4">
        <h1 className="font- w-full text-3xl font-normal">
          Your Locker is Empty
        </h1>
        <div className="mb-12 flex flex-col space-y-4 font-normal text-white">
          <span>
            Tell your employer or clients to pay you at your Locker address.
          </span>
          <span>
            You can also deposit yourself by transferring funds to your Locker
            address from another account.
          </span>
        </div>
        <div className="flex flex-col space-y-4 font-normal text-zinc-300">
          <div className="flex flex-col items-center justify-center space-y-2">
            <span className="text-xl font-semibold text-white">Locker</span>
            <QRCodeSVG className="self-center" value={lockerAddress} />
            <button
              className="flex items-center justify-center break-all text-[#4A22EC] outline-none hover:text-[#4C4FE4] hover:underline"
              onClick={() => copyToClipboard(lockerAddress, setCopied)}
            >
              <code>{lockerAddress}</code>
              {copied ? (
                <PiCheckSquareOffset
                  className="ml-3 shrink-0 text-emerald-500"
                  size="18px"
                />
              ) : (
                <PiCopy className="ml-3 shrink-0" size="18px" />
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
                      <div className="mr-3 flex h-7 w-7 shrink-0 items-center justify-center">
                        <img
                          className="w-7"
                          alt="gnosisChain"
                          src="iconGnosis.svg"
                        />
                      </div>
                      <span className="mr-3">Gnosis Chain</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="py-4">
                    <div className="flex items-center">
                      <div className="mr-3 flex h-7 w-7 shrink-0 items-center justify-center">
                        <img
                          className="w-7"
                          alt="baseSepolia"
                          src="iconBase.svg"
                        />
                      </div>
                      <span className="mr-3">Base Sepolia</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="py-4">
                    <div className="flex items-center">
                      <div className="mr-3 flex h-7 w-7 shrink-0 items-center justify-center">
                        <img
                          className="w-7"
                          alt="arbSepolia"
                          src="iconArbitrumOne.svg"
                        />
                      </div>
                      <span className="mr-3">Arbitrum Sepolia</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="py-4">
                    <div className="flex items-center">
                      <div className="mr-3 flex h-7 w-7 shrink-0 items-center justify-center">
                        <img
                          className="w-7"
                          alt="lineaSepolia"
                          src="iconLinea.svg"
                        />
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

// CODE TO DEPOSIT DIRECTLY HERE (DO NOT DELETE)
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
   */
