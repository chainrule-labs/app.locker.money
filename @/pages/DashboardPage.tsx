"use client";

import DashboardLockerEmpty from "@/components/dashboard/DashboardLockerEmpty";
import DashboardNoLocker from "@/components/dashboard/DashboardNoLocker";
import "@rainbow-me/rainbowkit/styles.css";
import { getLocker } from "app/actions/getLocker";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [isInitialCheck, setIsInitialCheck] = useState<boolean>(true);
  const [lockerAddress, setLockerAddress] = useState<`0x${string}` | null>(
    null,
  );
  const [numTxs, setNumTxs] = useState<number>(0);

  const getLockerInfo = async () => {
    const { locker, txs } = await getLocker();
    console.log("\n\nlocker", locker);
    console.log("\n\ntxs", txs);
    console.log("\n\n");
    console.log(txs.length > 0 ? "funded" : "empty");
    setLockerAddress(locker?.lockerAddress as `0x${string}`);
    setNumTxs(txs.length);
  };

  const initialLockerCheck = async () => {
    const { locker, txs } = await getLocker();
    setLockerAddress(locker?.lockerAddress as `0x${string}`);
    setNumTxs(txs.length);
    setIsInitialCheck(false);
  };

  useEffect(() => {
    // Check numTxs every 5 seconds
    const interval = setInterval(() => {
      getLockerInfo();
    }, 5000);

    // Cleanup the interval when the component unmounts
    return () => clearInterval(interval);
  }, [numTxs]);

  useEffect(() => {
    initialLockerCheck();
  }, []);

  const lockerState =
    !lockerAddress && isInitialCheck ? (
      <div className="flex h-full w-full items-center justify-center p-4">
        <span>Loading...</span>
      </div>
    ) : !lockerAddress && !isInitialCheck ? (
      <DashboardNoLocker />
    ) : lockerAddress && !isInitialCheck && numTxs < 1 ? (
      <DashboardLockerEmpty lockerAddress={lockerAddress} />
    ) : (
      <div className="flex h-full w-full items-center justify-center p-4">
        <span>DashboardFunded - Locker deposits: {numTxs}</span>
      </div>
    );

  return (
    <div className="xs:grid xs:place-content-center h-full w-full">
      <div className="flex flex-col justify-center">
        <div className="min-w-1/3 flex flex-col space-y-12">{lockerState}</div>
      </div>
    </div>
  );
}
