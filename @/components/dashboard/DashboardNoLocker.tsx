"use client";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { createLockerRecord } from "app/actions/createLockerRecord";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

export default function DashboardNoLocker() {
  const [isCreatingLocker, setIsCreatingLocker] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();
  const { openConnectModal } = useConnectModal();
  const { address, isConnected } = useAccount();

  const genLockerAddress = async () => {
    setErrorMessage(null);
    try {
      await createLockerRecord(address);
      router.refresh();
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes("lockers_owner_address_unique")) {
          setErrorMessage(
            "A Locker already exists for this wallet address. Try switching to a different account in your wallet.",
          );
        } else {
          setErrorMessage(`${error}`);
        }
      }
    }
  };

  useEffect(() => {
    if (isCreatingLocker && address) {
      genLockerAddress();
    }
  }, [address, isCreatingLocker]);

  useEffect(() => {
    if (errorMessage) {
      setIsCreatingLocker(false);
    }
  }, [errorMessage]);

  let createLockerButton = null;
  if (isCreatingLocker && isConnected) {
    createLockerButton = (
      <button
        className="w-full cursor-wait rounded-lg bg-[#3040EE] py-3 text-2xl text-white hover:bg-[#515EF1]"
        disabled
      >
        Setting up Locker...
      </button>
    );
  } else {
    createLockerButton = (
      <button
        className="w-full rounded-xl bg-[#3040EE] py-3 text-lg hover:bg-[#515EF1]"
        onClick={() => {
          if (openConnectModal) {
            openConnectModal();
          }
          setIsCreatingLocker(true);
        }}
      >
        Create Locker
      </button>
    );
  }

  return (
    <div className="flex w-full flex-1 flex-col items-center justify-start p-4">
      <div className="mb-12 flex flex-col space-y-8">
        <h1 className="w-full text-4xl">How Locker works</h1>
        <ol className="space-y-6 text-lg">
          <li className="flex">
            <span className="whitespace-nowrap text-3xl">1️⃣</span>
            <span className="ml-4 flex-1">
              <strong className="bg-gradient-to-r from-[#2AAAD9] to-[#5C6BF1] bg-clip-text text-3xl text-transparent">
                Create
              </strong>{" "}
              a Locker for your savings.
            </span>
          </li>
          <li className="flex">
            <span className="whitespace-nowrap text-3xl">2️⃣</span>
            <span className="ml-4 flex-1">
              <strong className="bg-gradient-to-r from-[#2AAAD9] to-[#5C6BF1] bg-clip-text text-3xl text-transparent">
                Customize
              </strong>{" "}
              how your Locker distributes future deposits.
            </span>
          </li>
          <li className="flex">
            <span className="whitespace-nowrap text-3xl">3️⃣</span>
            <span className="ml-4 flex-1">
              <strong className="bg-gradient-to-r from-[#2AAAD9] to-[#5C6BF1] bg-clip-text text-3xl text-transparent">
                Get paid
              </strong>{" "}
              at your Locker address to start automatically saving and
              investing.
            </span>
          </li>
        </ol>
      </div>
      {errorMessage && (
        <div className="mb-6 flex w-full items-center justify-center text-red-500">
          <span>{errorMessage}</span>
        </div>
      )}
      {createLockerButton}
      <div className="mt-4 flex w-full items-center justify-center text-sm text-zinc-400">
        <span>It&apos;s free!</span>
      </div>
    </div>
  );
}
