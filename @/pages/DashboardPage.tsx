"use client";

import DashboardLockerEmpty from "@/components/dashboard/DashboardLockerEmpty";
// import DashboardLockerPortfolio from "@/components/dashboard/DashboardLockerPortfolio";
import DashboardLockerSetup from "@/components/dashboard/DashboardLockerSetup";
import DashboardNoLocker from "@/components/dashboard/DashboardNoLocker";
import { PATHS } from "@/lib/paths";
import "@rainbow-me/rainbowkit/styles.css";
import { getLocker } from "app/actions/getLocker";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function DashboardPage() {
  const isFirstRender = useRef(true);
  const [locker, setLocker] = useState<any>(null);
  const [transactions, setTransactions] = useState<any>(null);
  const [initialTxLength, setInitialTxLength] = useState<number>(0);
  const [latestTxLength, setLatestTxLength] = useState<number>(0);
  const router = useRouter();

  const fetchLockerInfo = async () => {
    const { locker, txs } = await getLocker();
    setLocker(locker);
    if (isFirstRender.current) {
      setInitialTxLength(txs.length);
      isFirstRender.current = false;
    }
    setLatestTxLength(txs.length);
    setTransactions(txs);
  };

  // Fetch locker info on mount and every 5 seconds
  useEffect(() => {
    fetchLockerInfo();
    const interval = setInterval(fetchLockerInfo, 5000);
    return () => clearInterval(interval);
  }, []);

  const lockerAddress = locker?.lockerAddress;

  // Navigate to transaciton page
  useEffect(() => {
    if (!!locker && initialTxLength === 0 && latestTxLength > 0) {
      router.push(`${PATHS.TX}/${transactions[0].transactions.hash}`);
    }
  }, [lockerAddress, initialTxLength, latestTxLength, router, transactions]);

  const lockerState =
    !lockerAddress && isFirstRender.current ? (
      <div className="mt-28 flex size-full items-center justify-center text-2xl">
        <span>Loading...</span>
      </div>
    ) : !lockerAddress && !isFirstRender.current ? (
      <DashboardNoLocker />
    ) : lockerAddress && !isFirstRender.current && latestTxLength === 0 ? (
      <DashboardLockerEmpty lockerAddress={lockerAddress} />
    ) : lockerAddress &&
      !isFirstRender.current &&
      initialTxLength > 0 &&
      latestTxLength > 0 ? (
      <DashboardLockerSetup locker={locker} transaction={transactions[0]} />
    ) : // <DashboardLockerPortfolio />
    null;

  return (
    <div className="xs:grid xs:place-content-center size-full p-4">
      <div className="flex flex-col justify-center">
        <div className="flex flex-col space-y-12">{lockerState}</div>
      </div>
    </div>
  );
}
