"use server";

import { DEFAULT_ZERODEV_SEED, PROVIDER_ZERODEV } from "@/lib/constants";
import { getDrizzleDb } from "@/lib/drizzle";
import { getSmartAccountAddress } from "@/lib/zerodev";
import { clerkClient, currentUser } from "@clerk/nextjs";
import { lockers } from "db/schema";

export async function createLockerRecord(ownerAddress: string | undefined) {
  if (!ownerAddress) {
    throw new Error(`ownerAddress not provided.`);
  }

  const user = await currentUser();
  if (!user) {
    throw new Error(`Not logged in.`);
  }

  // Compute and validate seed
  const lockerSeed = BigInt(DEFAULT_ZERODEV_SEED);

  // Compute and validate address
  const lockerAddress = await getSmartAccountAddress(ownerAddress);

  const lockerInfo = {
    lockerSeed: lockerSeed.toString(),
    lockerAddress,
    ownerAddress,
  };

  // Insert locker in DB
  const locker = {
    userId: user.id,
    seed: lockerSeed.toString(),
    provider: PROVIDER_ZERODEV,
    ownerAddress: ownerAddress,
    lockerAddress: lockerAddress,
  };

  const db = getDrizzleDb();
  await db.insert(lockers).values(locker);
  console.log("inserted locker", locker);

  // Update metadata with Locker information
  await clerkClient.users.updateUserMetadata(user!.id, {
    privateMetadata: lockerInfo,
  });

  return lockerInfo;
}
