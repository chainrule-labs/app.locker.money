"use client";

import DashboardLockerEmpty from "@/components/dashboard/DashboardLockerEmpty";
import DashboardLockerSetup from "@/components/dashboard/DashboardLockerSetup";
import DashboardNoLocker from "@/components/dashboard/DashboardNoLocker";

import "@rainbow-me/rainbowkit/styles.css";

export default function DashboardPage({
  locker,
  lockerUsdValue,
  transaction,
}: {
  locker: any;
  lockerUsdValue: string;
  transaction: any;
}) {
  console.log("lockerAddress", locker?.lockerAddress);

  const lockerState = !locker?.lockerAddress ? (
    <DashboardNoLocker />
  ) : !transaction ? (
    <DashboardLockerEmpty lockerAddress={locker?.lockerAddress} />
  ) : (
    <DashboardLockerSetup
      locker={locker}
      transaction={transaction}
      lockerUsdValue={lockerUsdValue}
    />
  );

  return (
    <div className="xs:grid xs:place-content-center h-[100svh] w-full">
      <div className="flex flex-col justify-center">
        <div className="min-w-1/3 flex flex-col space-y-12">{lockerState}</div>
      </div>
    </div>
  );
}
