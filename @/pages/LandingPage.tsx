"use client";

import { PATHS } from "@/lib/paths";
import { useClerk } from "@clerk/nextjs";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import "node_modules/@rainbow-me/rainbowkit/dist/index.css";
import { useAccount } from "wagmi";

type ILandingPageProps = {
  userId: string | null;
};

export default function LandingPage({ userId }: ILandingPageProps) {
  const Clerk = useClerk();

  const { openConnectModal } = useConnectModal();
  const { isConnected } = useAccount();

  return (
    <div className="xs:grid xs:place-content-center h-full w-full p-4">
      <div className="mb-12 flex flex-col space-y-4">
        <h1 className="font- w-full text-4xl font-normal">
          Automated On-Chain Savings & Investments
        </h1>
        <h2 className="text-lg font-normal text-zinc-300">
          Save and invest on-chain every time you get paid.
        </h2>
      </div>
      {userId && isConnected ? (
        <Link href={PATHS.HOME}>
          <button className="w-full rounded-lg bg-[#4A22EC] py-2 hover:bg-[#4C4FE4]">
            Open Dashboard
          </button>
        </Link>
      ) : userId && !isConnected && openConnectModal ? (
        <button
          className="w-full rounded-lg bg-[#4A22EC] py-2 hover:bg-[#4C4FE4]"
          onClick={() => openConnectModal()}
        >
          Connect Wallet
        </button>
      ) : (
        <button
          className="w-full rounded-lg bg-[#4A22EC] py-2 hover:bg-[#4C4FE4]"
          onClick={() => Clerk.openSignIn()}
        >
          Get Started
        </button>
      )}
    </div>
  );
}
