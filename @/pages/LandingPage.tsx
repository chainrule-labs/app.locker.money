"use client";

import { PATHS } from "@/lib/paths";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function LandingPage() {
  const [stepNum, setStepNum] = useState(1);

  const step1 = (
    <>
      <span className="poppins w-full text-4xl font-bold">Locker</span>
      <Image
        src="/iconLockerDarkBg.png"
        alt="logo"
        width={100}
        height={100}
        className="mx-auto w-2/3"
      />
      <span className="w-full text-2xl font-bold">
        Save on-chain when you get paid.
      </span>
      <span className="text-lg">Some more info about why this is so cool.</span>
      <button
        className="w-full rounded-lg bg-blue-500 py-2 text-white"
        onClick={() => setStepNum(stepNum + 1)}
      >
        Get Started
      </button>
    </>
  );

  const step2 = (
    <>
      <span className="poppins w-full text-4xl font-bold">How it works</span>

      <span className="text-lg">1. Create Locker for your savings.</span>
      <span className="text-lg">
        2. Deposit into Locker to route money anywhere and auto-save.
      </span>
      <Link href={PATHS.HOME}>
        <button className="w-full rounded-lg bg-blue-500 py-2 text-white">
          Sign up
        </button>
      </Link>
    </>
  );

  const step = stepNum === 1 ? step1 : step2;
  return (
    <div className="xs:grid xs:place-content-center h-[100svh] w-full">
      <div className="flex justify-center">
        <div className="min-w-1/3 flex flex-col space-y-12">{step}</div>
      </div>
    </div>
  );
}
