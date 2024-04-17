"use client";

export default function DashboardLockerSetup({
  lockerAddress,
}: {
  lockerAddress: string;
}) {
  return (
    <>
      <div className="space-y-12">
        <p className="poppins w-full text-2xl font-bold">
          Set up savings rules
        </p>

        <div>
          <p>Congratulations, you funded your Locker with $0.00.</p>
          <p>
            To take it to the next level, automate your money moves by setting
            up a saving rule.
          </p>
        </div>

        <p className="text">
          Arbitrum Sepolia, Base Sepolia, Linea Sepolia, and Gnosis mainnet
          supported.
        </p>
      </div>
    </>
  );
}
