"use client";

import DashboardNoLocker from "@/components/dashboard/DashboardNoLocker";
import "@rainbow-me/rainbowkit/styles.css";

export default function DashboardPage({
  lockerAddress,
}: {
  lockerAddress: string | undefined;
}) {
  const lockerCreated = !lockerAddress;

  const lockerState = lockerCreated ? <DashboardNoLocker /> : null;

  return (
    <div className="xs:grid xs:place-content-center h-[100svh] w-full">
      <div className="flex justify-center">
        <div className="min-w-1/3 flex flex-col space-y-12">{lockerState}</div>
      </div>
    </div>
  );
}
