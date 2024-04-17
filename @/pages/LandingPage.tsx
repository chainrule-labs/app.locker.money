"use client";

import { PATHS } from "@/lib/paths";
import { useClerk } from "@clerk/nextjs";
import Link from "next/link";

type ILandingPageProps = {
  userId: string | null;
};

export default function LandingPage({ userId }: ILandingPageProps) {
  // const buttonText = userId ? "Open Dashboard" : "Get Started";
  const Clerk = useClerk();

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
      {userId ? (
        <Link href={PATHS.HOME}>
          <button className="w-full rounded-lg bg-[#4C4FE4] py-2">
            Open Dashboard
          </button>
        </Link>
      ) : (
        <button
          className="w-full rounded-lg bg-[#4C4FE4] py-2"
          onClick={() => Clerk.openSignIn()}
        >
          Get Started
        </button>
      )}
    </div>
  );
}
