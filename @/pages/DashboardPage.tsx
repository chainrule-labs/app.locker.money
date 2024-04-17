"use client";

import DashboardLockerEmpty from "@/components/dashboard/DashboardLockerEmpty";
import DashboardNoLocker from "@/components/dashboard/DashboardNoLocker";

import "@rainbow-me/rainbowkit/styles.css";

export default function DashboardPage({
  lockerAddress,
  numTxs,
}: {
  lockerAddress: string | undefined;
  numTxs: number;
}) {
  console.log("lockerAddress", lockerAddress);

  const lockerState = !lockerAddress ? (
    <DashboardNoLocker />
  ) : numTxs < 1 ? (
    <DashboardLockerEmpty lockerAddress={lockerAddress} />
  ) : (
    <p>Locker deposits: {numTxs}</p>
  );

  return (
    <div className="xs:grid xs:place-content-center h-[100svh] w-full">
      <div className="flex flex-col justify-center">
        <div className="min-w-1/3 flex flex-col space-y-12">{lockerState}</div>
      </div>
    </div>
  );
}
