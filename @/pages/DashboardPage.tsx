"use client";

import DashboardLockerEmpty from "@/components/dashboard/DashboardLockerEmpty";
import DashboardNoLocker from "@/components/dashboard/DashboardNoLocker";
import { useEvmNativeBalance } from "@moralisweb3/next";

import "@rainbow-me/rainbowkit/styles.css";

export default function DashboardPage({
  lockerAddress,
}: {
  lockerAddress: string | undefined;
}) {
  console.log("lockerAddress", lockerAddress);
  const { data: nativeBalance } = useEvmNativeBalance({
    address: lockerAddress || "",
    chain: "sepolia",
  });

  console.log("nativeBalance", nativeBalance);

  const lockerState = !lockerAddress ? (
    <DashboardNoLocker />
  ) : !nativeBalance ? (
    <DashboardLockerEmpty lockerAddress={lockerAddress} />
  ) : null;

  return (
    <div className="xs:grid xs:place-content-center h-[100svh] w-full">
      <div className="flex flex-col justify-center">
        <div className="min-w-1/3 flex flex-col space-y-12">{lockerState}</div>
      </div>
    </div>
  );
}
