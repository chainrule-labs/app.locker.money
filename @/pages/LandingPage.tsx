"use client";

import { PATHS } from "@/lib/paths";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import "node_modules/@rainbow-me/rainbowkit/dist/index.css";
import { useEffect } from "react";

type ILandingPageProps = {
  userId: string | null;
};

export default function LandingPage({ userId }: ILandingPageProps) {
  const router = useRouter();
  const Clerk = useClerk();

  useEffect(() => {
    if (userId) {
      router.push(PATHS.HOME);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      router.push(PATHS.HOME);
    }
  }, []);

  return (
    <div className="xs:grid xs:place-content-center h-full w-full p-4">
      <div className="mb-12 flex flex-col space-y-10">
        <h1 className="font- w-full text-4xl font-normal">
          Automate Your Money
        </h1>
        <h2 className="text-2xl font-normal text-zinc-300">
          Save and invest on-chain every time you get paid or make a deposit.
        </h2>
      </div>
      <button
        className="w-full rounded-lg bg-[#4A22EC] py-3 text-3xl hover:bg-[#4C4FE4]"
        onClick={() => Clerk.openSignUp()}
      >
        Get Started
      </button>
    </div>
  );
}
