"use client";

import { PATHS } from "@/lib/paths";
import { useClerk } from "@clerk/nextjs";
import Footer from "app/Footer";
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
    <div className="flex w-full flex-1 flex-col items-center justify-start p-4">
      <div className="mb-12 flex flex-col space-y-8">
        <h1 className="w-full text-4xl">Automate Your Money</h1>
        <h2 className="text-xl text-zinc-300">
          Save and invest on-chain every time you get paid or make a deposit.
        </h2>
      </div>
      <button
        className="w-full max-w-96 shrink items-center justify-center rounded-xl bg-[#3040EE] py-3 text-lg hover:bg-[#515EF1]"
        onClick={() => Clerk.openSignUp()}
      >
        Get Started
      </button>
      {/* Putting Footer here for now. See app/layout.tsx comment. */}
      <Footer />
    </div>
  );
}
