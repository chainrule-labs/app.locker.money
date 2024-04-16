"use server";

import { DEFAULT_ZERODEV_SEED } from "@/lib/constants";
import { getSmartAccountAddress } from "@/lib/zerodev";
import { clerkClient, currentUser } from "@clerk/nextjs";

export async function setLocker(ownerAddress: string | undefined) {
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

  // Update metadata with Locker information
  await clerkClient.users.updateUserMetadata(user!.id, {
    privateMetadata: lockerInfo,
  });

  return lockerInfo;
}
