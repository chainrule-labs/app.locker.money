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
        className="w-full cursor-not-allowed rounded-lg bg-[#4A22EC] py-2 text-white hover:bg-[#4C4FE4]"
        disabled
      >
        Setting up Locker...
      </button>
    );
  } else {
    createLockerButton = (
      <button
        className="w-full rounded-lg bg-[#4A22EC] py-2 text-white hover:bg-[#4C4FE4]"
        onClick={() => {
          if (openConnectModal) {
            openConnectModal();
          }
          setIsCreatingLocker(true);
        }}
      >
        Create a Locker
      </button>
    );
  }

  return (
    <div className="xs:grid xs:place-content-center size-full p-4">
      <div className="mb-12 flex flex-col space-y-4">
        <h1 className="w-full text-3xl font-normal">How does Locker work?</h1>
        <ol className="list-decimal space-y-4 pl-8 font-normal text-zinc-300">
          <li>Create a Locker for your savings.</li>
          <li>
            <span>
              Program your Locker so it knows what to do with future deposits.
            </span>
          </li>
          <li>
            Tell your employer or clients to pay you at your Locker address.
          </li>
        </ol>
      </div>
      {errorMessage && (
        <div className="mb-6 flex w-full items-center justify-center font-normal text-red-500">
          <span>{errorMessage}</span>
        </div>
      )}
      {createLockerButton}
    </div>
  );
}
