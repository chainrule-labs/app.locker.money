"use client";

import { useConnectModal } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { setLocker } from "app/actions/setLocker";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAccount, useConfig } from "wagmi";

export default function DashboardNoLocker() {
  const { openConnectModal } = useConnectModal();
  const config = useConfig();
  const [isCreatingLocker, setIsCreatingLocker] = useState(false);
  const router = useRouter();
  const { isConnected, address, chain } = useAccount();

  const onCreateLocker = async () => {
    console.log("onCreateLocker", isConnected, address);
    setIsCreatingLocker(true);
    if (!isConnected && openConnectModal) {
      openConnectModal();
    }
  };

  const genLockerAddress = async () => {
    console.log("genLockerAddress", address);
    const lockerInfo = await setLocker(address);
    console.log("lockerInfo", lockerInfo);
    router.refresh();
  };
  useEffect(() => {
    console.log("trigger gen-address", address, isCreatingLocker);
    if (isCreatingLocker && address) {
      // generate locker address
      genLockerAddress();
    }
  }, [address, isCreatingLocker]);

  let createLockerButton = null;
  if (isCreatingLocker) {
    createLockerButton = (
      <button
        className="w-full rounded-lg bg-blue-500 py-2 text-white"
        disabled
      >
        Setting up Locker...
      </button>
    );
  } else {
    createLockerButton = (
      <button
        className="w-full rounded-lg bg-blue-500 py-2 text-white"
        onClick={onCreateLocker}
      >
        Create Locker
      </button>
    );
  }

  return (
    <>
      <div className="space-y-12">
        <p className="poppins w-full text-2xl font-bold">How Locker works</p>
        <p className="text">1. Create a Locker for your savings.</p>
        <p className="text">
          2. Deposit into your Locker to route money anywhere and save
          automoatically.
        </p>
        {createLockerButton}
      </div>
    </>
  );
}
