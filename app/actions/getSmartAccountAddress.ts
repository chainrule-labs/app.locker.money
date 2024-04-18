"use server";

import { DEFAULT_ZERODEV_SEED } from "@/lib/constants";
import { getKernelAddressFromECDSA } from "@zerodev/ecdsa-validator";
import { ENTRYPOINT_ADDRESS_V07 } from "permissionless";
import { createPublicClient, http } from "viem";

/**
 * Get the kernel address for a given owner EOA address
 * @param address
 * @returns
 */
export const getSmartAccountAddress = async (address: string | undefined) => {
  "use server";
  if (!address) throw new Error(`address not provided.`);

  const publicClient = createPublicClient({
    transport: http(process.env.NEXT_PUBLIC_BUNDLER_RPC),
  });

  const smartAccountAddress = await getKernelAddressFromECDSA({
    publicClient,
    eoaAddress: address as `0x${string}`,
    index: BigInt(DEFAULT_ZERODEV_SEED),
    entryPointAddress: ENTRYPOINT_ADDRESS_V07,
  });

  return smartAccountAddress;
};
