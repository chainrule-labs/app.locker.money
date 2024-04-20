"use server";

import { getKernelAddressFromECDSA } from "@zerodev/ecdsa-validator";
import { deserializePermissionAccount } from "@zerodev/permissions";
import { toECDSASigner } from "@zerodev/permissions/signers";
import {
  createKernelAccountClient,
  createZeroDevPaymasterClient,
} from "@zerodev/sdk";

import { lockers } from "db/schema";
import { eq } from "drizzle-orm";
import { ENTRYPOINT_ADDRESS_V07 } from "permissionless";
import process from "process";
import {
  // Chain,
  createPublicClient,
  encodeFunctionData,
  http,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { DEFAULT_ZERODEV_SEED } from "./constants";
import { getNeonDrizzleDb } from "./database";
import { chainId2ZeroDevClientInfo } from "./utils";
import { ERC20_TRANSFER_ABI, chainId2Chain } from "./viem";

const entryPoint = ENTRYPOINT_ADDRESS_V07;

/**
 * Get the kernel address for a given owner EOA address
 * @param address
 * @returns
 */
export const getSmartAccountAddress = async (address: string | undefined) => {
  if (!address) throw new Error(`address not provided.`);

  const publicClient = createPublicClient({
    transport: http(process.env.NEXT_PUBLIC_BUNDLER_RPC_SEPOLIA!),
  });

  const smartAccountAddress = await getKernelAddressFromECDSA({
    publicClient,
    eoaAddress: address as `0x${string}`,
    index: BigInt(DEFAULT_ZERODEV_SEED),
    entryPointAddress: entryPoint,
  });

  return smartAccountAddress;
};

export const transferOnUserBehalf = async (transaction: any) => {
  console.log("transferOnUserBehalf");
  console.log(transaction);

  // Get the session key from the locker entry
  const db = getNeonDrizzleDb();
  const _lockers = await db
    .select()
    .from(lockers)
    .where(eq(lockers.id, transaction.lockerId));

  if (_lockers.length === 0) throw new Error(`Locker not found.`);

  const locker = _lockers[0];
  const { encryptedSessionKey: serializedSessionKey } = locker;
  if (serializedSessionKey === null) throw new Error(`Session key not found.`);

  const sessionKeyRawAccount = privateKeyToAccount(
    process.env.SIGNER_PRIVATE_KEY! as `0x${string}`,
  );

  const sessionKeySigner = await toECDSASigner({
    signer: sessionKeyRawAccount,
  });

  const { rpc, paymaster } = chainId2ZeroDevClientInfo(transaction.chainId);
  const publicClient = createPublicClient({
    transport: http(rpc),
  });

  const sessionKeyAccount = await deserializePermissionAccount(
    publicClient,
    entryPoint,
    serializedSessionKey,
    sessionKeySigner,
  );

  const chain = chainId2Chain(transaction.chainId);

  const kernelPaymaster = createZeroDevPaymasterClient({
    entryPoint,
    chain,
    transport: http(paymaster),
  });

  const kernelClient = createKernelAccountClient({
    entryPoint,
    account: sessionKeyAccount,
    chain,
    bundlerTransport: http(rpc),
    middleware: {
      sponsorUserOperation: kernelPaymaster.sponsorUserOperation,
    },
  });

  const savingsFactor =
    parseFloat(locker.autosavePctRemainInLocker || "0.0") / 100;
  const amountRaw = BigInt(parseFloat(transaction.amountRaw) * savingsFactor);
  console.log("Session:", sessionKeyAccount.address);
  console.log("Amount raw:", amountRaw);
  console.log("Locker owner:", locker.ownerAddress);

  const userOpHash = await kernelClient.sendUserOperation({
    userOperation: {
      // preVerificationGas: "0x186A0",
      // callGasLimit: "0xD6D8",
      // verificationGasLimit: "0xF4240",
      callData: await sessionKeyAccount.encodeCallData({
        to: transaction.tokenAddress,
        value: BigInt(0),
        // callType: "delegatecall",
        data: encodeFunctionData({
          abi: ERC20_TRANSFER_ABI,
          functionName: "transfer",
          args: [locker.ownerAddress as `0x${string}`, amountRaw],
        }),
      }),
    },
  });

  console.log("userOp hash:", userOpHash);
};
