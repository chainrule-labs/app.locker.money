"use client";

import DashboardLockerEmpty from "@/components/dashboard/DashboardLockerEmpty";
import DashboardLockerSetup from "@/components/dashboard/DashboardLockerSetup";
import DashboardNoLocker from "@/components/dashboard/DashboardNoLocker";
import { getPortfolio } from "@/lib/moralis";
import "@rainbow-me/rainbowkit/styles.css";
import { getLocker } from "app/actions/getLocker";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [isInitialCheck, setIsInitialCheck] = useState<boolean>(true);
  const [lockerAddress, setLockerAddress] = useState<`0x${string}` | null>(
    null,
  );
  // const [numTxs, setNumTxs] = useState<number>(0);
  const [transaction, setTransaction] = useState<any>(null);
  const [lockerUsdValue, setLockerUsdValue] = useState<string>("$0.00");

  const getLockerInfo = async () => {
    const { locker, txs } = await getLocker();
    setLockerAddress(locker?.lockerAddress as `0x${string}`);
    // setNumTxs(txs.length);
    setTransaction(txs[0] && txs.length > 0);
    if (!!locker) {
      const portfolio = await getPortfolio(locker?.lockerAddress);
      setLockerUsdValue(portfolio!.totalNetworthUsd);
    }
  };

  const initialLockerCheck = async () => {
    const { locker, txs } = await getLocker();
    setLockerAddress(locker?.lockerAddress as `0x${string}`);
    // setNumTxs(txs.length);
    setTransaction(txs[0]);
    if (!!locker && txs.length > 0) {
      const portfolio = await getPortfolio(locker?.lockerAddress);
      setLockerUsdValue(portfolio!.totalNetworthUsd);
    }
    setIsInitialCheck(false);
  };

  useEffect(() => {
    // Check for transaction every 5 seconds
    const interval = setInterval(() => {
      getLockerInfo();
    }, 5000);

    // Cleanup the interval when the component unmounts
    return () => clearInterval(interval);
  }, [transaction]);

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
    ) : lockerAddress && !isInitialCheck && !transaction ? (
      <DashboardLockerEmpty lockerAddress={lockerAddress} />
    ) : (
      <DashboardLockerSetup
        locker={lockerAddress}
        transaction={transaction}
        lockerUsdValue={lockerUsdValue}
      />
    );

  return (
    <div className="xs:grid xs:place-content-center h-full w-full">
      <div className="flex flex-col justify-center">
        <div className="min-w-1/3 flex flex-col space-y-12">{lockerState}</div>
      </div>
    </div>
  );
}
