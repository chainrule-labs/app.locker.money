import {
  getKernelAddressFromECDSA,
  signerToEcdsaValidator,
} from "@zerodev/ecdsa-validator";
import {
  deserializePermissionAccount,
  serializePermissionAccount,
  toPermissionValidator,
} from "@zerodev/permissions";
import { ParamCondition, toCallPolicy } from "@zerodev/permissions/policies";
import { toECDSASigner } from "@zerodev/permissions/signers";
import {
  addressToEmptyAccount,
  createKernelAccount,
  createKernelAccountClient,
  createZeroDevPaymasterClient,
} from "@zerodev/sdk";
import { lockers } from "db/schema";
import { eq } from "drizzle-orm";
import {
  ENTRYPOINT_ADDRESS_V07,
  walletClientToSmartAccountSigner,
} from "permissionless";
import {
  // Chain,
  createPublicClient,
  encodeFunctionData,
  http,
  zeroAddress,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { DEFAULT_ZERODEV_SEED } from "./constants";
import { getNeonDrizzleDb } from "./database";
import { ERC20_TRANSFER_ABI, chainId2Chain } from "./viem";

if (!process.env.NEXT_PUBLIC_BUNDLER_RPC) {
  throw new Error("NEXT_PUBLIC_BUNDLER_RPC is not set");
}

const publicClient = createPublicClient({
  transport: http(process.env.NEXT_PUBLIC_BUNDLER_RPC),
});

const entryPoint = ENTRYPOINT_ADDRESS_V07;

/**
 * Create a kernel that:
 *  - is controlled by the user's EOA
 *  - creates a session key that can transfer ERC20 to the EOA
 * @param walletClient
 * @param chain
 */
export const createKernel = async (
  walletClient: any,
  ownerAddress: string,
  transaction: any,
  // chain: Chain,
  expectedKernelAddress: string,
) => {
  console.log("createKernel");

  // Get user's kernel
  const { account: userKernelAccount, validator: userValidator } =
    await createUserKernelAccount(walletClient);

  console.log("User account:", userKernelAccount.address);
  if (userKernelAccount.address !== expectedKernelAddress)
    throw new Error("Kernel address does not match expected address");

  // Get session kernel
  const { account: sessionKernelAccount, serializedKey: serializedSessionKey } =
    await createSessionKernelAccount({
      ownerAddress,
      ownerValidator: userValidator,
    });

  console.log("Session account:", sessionKernelAccount.address);

  // Save session key to DB
  await saveSessionKeyToDb(serializedSessionKey, transaction.lockerId);
  console.log("Saved session key to DB");

  // Transfer to create accounts
  await transferOnBehalf(serializedSessionKey, transaction);
  console.log("Finished transfer");
};

/**
 * Get the kernel address for a given owner EOA address
 * @param address
 * @returns
 */
export const getSmartAccountAddress = async (address: string | undefined) => {
  if (!address) throw new Error(`address not provided.`);

  const smartAccountAddress = await getKernelAddressFromECDSA({
    publicClient,
    eoaAddress: address as `0x${string}`,
    index: BigInt(DEFAULT_ZERODEV_SEED),
    entryPointAddress: entryPoint,
  });

  return smartAccountAddress;
};

/**
 * Update lockers.encryptSessionKey with the serialized session key
 * @param serializedSessionKey
 * @param lockerId
 */
const saveSessionKeyToDb = async (
  serializedSessionKey: string,
  lockerId: number,
) => {
  const db = getNeonDrizzleDb();
  await db
    .update(lockers)
    .set({ encryptedSessionKey: serializedSessionKey })
    .where(eq(lockers.id, lockerId));
};

/**
 * Create the kernel account for the user
 * @param param0
 * @returns
 */
const createUserKernelAccount = async ({
  walletClient,
}: {
  walletClient: any;
}) => {
  const signer = walletClientToSmartAccountSigner(walletClient!);

  const ecdsaValidator = await signerToEcdsaValidator(publicClient, {
    signer: signer,
    entryPoint,
  });

  const account = await createKernelAccount(publicClient, {
    plugins: {
      sudo: ecdsaValidator,
    },
    entryPoint,
  });

  return { account, validator: ecdsaValidator };
};

/**
 * Create the session kernel account
 * @param param0
 * @returns
 */
const createSessionKernelAccount = async ({
  ownerAddress,
  ownerValidator,
}: {
  ownerAddress: string;
  ownerValidator: any;
}) => {
  const sessionKeyAccount = privateKeyToAccount(
    process.env.SIGNER_PRIVATE_KEY! as `0x${string}`,
  );

  const emptyAccount = addressToEmptyAccount(sessionKeyAccount.address);
  const emptySessionKeySigner = await toECDSASigner({ signer: emptyAccount });

  const callPolicy = toCallPolicy({
    permissions: [
      {
        target: zeroAddress,
        valueLimit: BigInt(0),
        // abi: [ERC20TransferFunctionABI],
        abi: ERC20_TRANSFER_ABI,
        functionName: "transfer",
        args: [
          {
            condition: ParamCondition.EQUAL,
            value: ownerAddress as `0x${string}`,
          },
          null,
        ],
      },
    ],
  });

  const sessionKeyValidator = await toPermissionValidator(publicClient, {
    entryPoint,
    signer: emptySessionKeySigner,
    policies: [callPolicy],
  });

  const sessionKernelAccount = await createKernelAccount(publicClient, {
    entryPoint,
    plugins: {
      sudo: ownerValidator,
      regular: sessionKeyValidator,
    },
  });

  const serializedSessionKey =
    await serializePermissionAccount(sessionKernelAccount);

  return { account: sessionKernelAccount, serializedKey: serializedSessionKey };
};

const transferOnBehalf = async (
  serializedSessionKey: string,
  transaction: any,
) => {
  const sessionKeyRawAccount = privateKeyToAccount(
    process.env.SIGNER_PRIVATE_KEY! as `0x${string}`,
  );

  const sessionKeySigner = await toECDSASigner({
    signer: sessionKeyRawAccount,
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
    transport: http(process.env.PAYMASTER_RPC),
  });

  const kernelClient = createKernelAccountClient({
    entryPoint,
    account: sessionKeyAccount,
    chain,
    bundlerTransport: http(process.env.BUNDLER_RPC),
    middleware: {
      sponsorUserOperation: kernelPaymaster.sponsorUserOperation,
    },
  });

  const amountRaw = BigInt(parseFloat(transaction.amountRaw) * 0.2);
  const userOpHash = await kernelClient.sendUserOperation({
    userOperation: {
      callData: await sessionKeyAccount.encodeCallData({
        to: transaction.tokenAddress,
        value: BigInt(0),
        data: encodeFunctionData({
          abi: ERC20_TRANSFER_ABI,
          functionName: "transfer",
          args: [sessionKeyAccount.address, amountRaw],
        }),
      }),
    },
  });

  console.log("userOp hash:", userOpHash);
};
