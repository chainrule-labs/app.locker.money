"use client";

import { PATHS } from "@/lib/paths";
import Image from "next/image";
import Link from "next/link";

type ILandingPageProps = {
  userId: string | null;
};

export default function LandingPage({ userId }: ILandingPageProps) {
  const buttonText = userId ? "Dashboard" : "Get Started";

  return (
    <div className="xs:grid xs:place-content-center h-[100svh] w-full">
      <div className="flex justify-center">
        <div className="min-w-1/3 flex flex-col space-y-12">
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
          <span className="text-lg">
            Some more info about why this is so cool.
          </span>
          <Link href={PATHS.HOME}>
            <button className="w-full rounded-lg bg-blue-500 py-2 text-white">
              {buttonText}
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
