"use client";

export default function DashboardLockerEmpty({
  lockerAddress,
}: {
  lockerAddress: string;
}) {
  return (
    <>
      <div className="space-y-12">
        <p className="poppins w-full text-2xl font-bold">
          Deposit ETH or any ERC20, to complete setup
        </p>

        <div>
          <p className="text-wrap break-all text-5xl">Locker address:</p>
          <p className="text-wrap break-all text-2xl">{lockerAddress}</p>
        </div>

        <p className="text">
          Arbitrum, Base, Linea, and Gnosis testnets supported.
        </p>
      </div>
    </>
  );
}
