"use client";

import { signerToEcdsaValidator } from "@zerodev/ecdsa-validator";
import {
  serializePermissionAccount,
  toPermissionValidator,
} from "@zerodev/permissions";
import {
  ParamCondition,
  toCallPolicy,
  toSudoPolicy,
} from "@zerodev/permissions/policies";
import { toECDSASigner } from "@zerodev/permissions/signers";
import { addressToEmptyAccount, createKernelAccount } from "@zerodev/sdk";
import {
  ENTRYPOINT_ADDRESS_V07,
  walletClientToSmartAccountSigner,
} from "permissionless";
import {
  // Chain,
  createPublicClient,
  http,
  zeroAddress,
} from "viem";
import { DEFAULT_ZERODEV_SEED } from "./constants";
import { chainId2ZeroDevClientInfo } from "./utils";

const entryPoint = ENTRYPOINT_ADDRESS_V07;

/**
 * Create a kernel that:
 *  - is controlled by the user's EOA
 *  - creates a session key that can transfer ERC20 to the EOA
 * @param walletClient
 * @param chain
 */
export const createUserAndSessionKernels = async (
  walletClient: any,
  ownerAddress: string,
  chainId: string,
  expectedKernelAddress: string,
) => {
  console.log("createKernel");

  // Get user's kernel
  const { account: userKernelAccount, validator: userValidator } =
    await createUserKernelAccount({ walletClient, chainId });

  console.log("User account:", userKernelAccount.address);

  // Validate kernel address
  if (
    userKernelAccount.address.toLowerCase() !==
    expectedKernelAddress.toLowerCase()
  )
    throw new Error(
      `Kernel address ${userKernelAccount.address} does not match expected address ${expectedKernelAddress}`,
    );

  // Get session kernel
  const { account: sessionKernelAccount, serializedKey: serializedSessionKey } =
    await createSessionKernelAccount({
      ownerAddress,
      ownerValidator: userValidator,
      chainId,
    });

  console.log("Session account:", sessionKernelAccount.address);

  return { serializedSessionKey };
};

/**
 * Create the kernel account for the user
 * @param param0
 * @returns
 */
const createUserKernelAccount = async ({
  walletClient,
  chainId,
}: {
  walletClient: any;
  chainId: string;
}) => {
  console.log("createUserKernelAccount");
  console.log(walletClient);
  const signer = walletClientToSmartAccountSigner(walletClient!);

  const { rpc, paymaster } = chainId2ZeroDevClientInfo(chainId);
  const publicClient = createPublicClient({
    transport: http(rpc),
  });

  console.log("created signer");
  const ecdsaValidator = await signerToEcdsaValidator(publicClient, {
    signer: signer,
    entryPoint,
  });

  const account = await createKernelAccount(publicClient, {
    index: BigInt(DEFAULT_ZERODEV_SEED),
    plugins: {
      sudo: ecdsaValidator,
    },
    entryPoint,
  });
  console.log("User account:", account.address);

  /*
    DEBUGGING CODE
    Should not be necessary to deploy SA here
    TODO: Remove before hackathon submission
  */
  // const chain = chainId2Chain(chainId);

  // const kernelClient = createKernelAccountClient({
  //   account,
  //   entryPoint,
  //   chain,
  //   bundlerTransport: http(rpc),
  //   middleware: {
  //     sponsorUserOperation: async ({ userOperation }) => {
  //       const paymasterClient = createZeroDevPaymasterClient({
  //         chain,
  //         transport: http(paymaster),
  //         entryPoint,
  //       });
  //       return paymasterClient.sponsorUserOperation({
  //         userOperation,
  //         entryPoint,
  //       });
  //     },
  //   },
  // });

  // console.log("created kernel client");
  // const userOpHash = await kernelClient.sendUserOperation({
  //   userOperation: {
  //     callData: await account.encodeCallData({
  //       to: zeroAddress,
  //       value: BigInt(0),
  //       data: "0x",
  //     }),
  //   },
  // });

  // console.log("userOp hash:", userOpHash);

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
  chainId,
}: {
  ownerAddress: string;
  ownerValidator: any;
  chainId: string;
}) => {
  const { rpc, paymaster } = chainId2ZeroDevClientInfo(chainId);
  const publicClient = createPublicClient({
    transport: http(rpc),
  });

  const emptyAccount = addressToEmptyAccount(
    process.env.NEXT_PUBLIC_SIGNER_PUBLIC_KEY! as `0x${string}`,
  );
  const emptySessionKeySigner = await toECDSASigner({ signer: emptyAccount });

  const callPolicy = toCallPolicy({
    permissions: [
      {
        target: zeroAddress,
        valueLimit: BigInt(0),
        // abi: [ERC20TransferFunctionABI],
        // abi: ERC20_TRANSFER_ABI,
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

  // FIXME should use callPolicy instead
  const sudoPolicy = toSudoPolicy({});

  const sessionKeyValidator = await toPermissionValidator(publicClient, {
    entryPoint,
    signer: emptySessionKeySigner,
    policies: [sudoPolicy],
  });

  const sessionKernelAccount = await createKernelAccount(publicClient, {
    entryPoint,
    index: BigInt(DEFAULT_ZERODEV_SEED),
    plugins: {
      sudo: ownerValidator,
      regular: sessionKeyValidator,
    },
  });

  const serializedSessionKey =
    await serializePermissionAccount(sessionKernelAccount);

  return { account: sessionKernelAccount, serializedKey: serializedSessionKey };
};
