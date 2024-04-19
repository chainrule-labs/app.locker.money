"use server";

import { DEFAULT_ZERODEV_SEED, PROVIDER_ZERODEV } from "@/lib/constants";
import { getNeonDrizzleDb } from "@/lib/database";
import { getSmartAccountAddress } from "@/lib/zerodev-server";
import { clerkClient, currentUser } from "@clerk/nextjs";
import { lockers } from "db/schema";

export async function createLockerRecord(_ownerAddress: string | undefined) {
  if (!_ownerAddress) {
    throw new Error(`ownerAddress not provided.`);
  }

  const user = await currentUser();
  if (!user) {
    throw new Error(`Not logged in.`);
  }

  // Compute and validate seed
  const lockerSeed = BigInt(DEFAULT_ZERODEV_SEED);

  // Compute and validate addresses
  const ownerAddress = _ownerAddress.toLowerCase();
  const _lockerAddress = await getSmartAccountAddress(ownerAddress);
  const lockerAddress = _lockerAddress.toLowerCase();

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
    ownerAddress,
    lockerAddress,
  };

  const db = getNeonDrizzleDb();
  await db.insert(lockers).values(locker);
  console.log("inserted locker", locker);

  // Update metadata with Locker information
  await clerkClient.users.updateUserMetadata(user!.id, {
    privateMetadata: lockerInfo,
  });

  return lockerInfo;
}
