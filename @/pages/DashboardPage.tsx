"use client";

import DashboardLockerEmpty from "@/components/dashboard/DashboardLockerEmpty";
import DashboardLockerSetup from "@/components/dashboard/DashboardLockerSetup";
import DashboardNoLocker from "@/components/dashboard/DashboardNoLocker";
import { PATHS } from "@/lib/paths";
import "@rainbow-me/rainbowkit/styles.css";
import { getLocker } from "app/actions/getLocker";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function DashboardPage() {
  const isFirstRender = useRef(true);
  const [lockerAddress, setLockerAddress] = useState<`0x${string}` | null>(
    null,
  );
  const [transactions, setTransactions] = useState<any>(null);
  const [initialTxLength, setInitialTxLength] = useState<number>(0);
  const [latestTxLength, setLatestTxLength] = useState<number>(0);
  const router = useRouter();

  const fetchLockerInfo = async () => {
    const { locker, txs } = await getLocker();
    setLockerAddress(locker?.lockerAddress as `0x${string}`);
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

  // Navigate to transaciton page
  useEffect(() => {
    if (lockerAddress && initialTxLength === 0 && latestTxLength > 0) {
      router.push(`${PATHS.TX}?txHash=${transactions[0].hash}`);
    }
  }, [lockerAddress, initialTxLength, latestTxLength, router]);

  const lockerState =
    !lockerAddress && isFirstRender.current ? (
      <div className="flex h-full w-full items-center justify-center p-4">
        <span>Loading...</span>
      </div>
    ) : !lockerAddress && !isFirstRender.current ? (
      <DashboardNoLocker />
    ) : lockerAddress && !isFirstRender.current && latestTxLength === 0 ? (
      <DashboardLockerEmpty lockerAddress={lockerAddress} />
    ) : (
      <DashboardLockerSetup
        locker={lockerAddress}
        transaction={transactions[0]}
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

// const lockerState =
//   !lockerAddress && isFirstRender.current ? (
//     <div className="flex h-full w-full items-center justify-center p-4">
//       <span>Loading...</span>
//     </div>
//   ) : !lockerAddress && !isFirstRender.current ? (
//     <DashboardNoLocker />
//   ) : lockerAddress && !isFirstRender.current && latestTxLength === 0 ? (
//     <DashboardLockerEmpty lockerAddress={lockerAddress} />
//   ) : lockerAddress &&
//     !isFirstRender.current &&
//     initialTxLength === 0 &&
//     latestTxLength > 0 ? (
//     <TransactionPage transaction={transactions[0]} />
//   ) : (
//     <span>DashboardLockerSetup</span>
//   );
