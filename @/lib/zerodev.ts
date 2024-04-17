import {
  getKernelAddressFromECDSA,
  signerToEcdsaValidator,
} from "@zerodev/ecdsa-validator";
import { toECDSASigner } from "@zerodev/permissions/signers";
import {
  createKernelAccount,
  createKernelAccountClient,
  createZeroDevPaymasterClient,
} from "@zerodev/sdk";
import {
  ENTRYPOINT_ADDRESS_V07,
  bundlerActions,
  walletClientToSmartAccountSigner,
} from "permissionless";
import { Chain, createPublicClient, http, zeroAddress } from "viem";
import { DEFAULT_ZERODEV_SEED } from "./constants";

if (
  !process.env.NEXT_PUBLIC_BUNDLER_RPC ||
  !process.env.NEXT_PUBLIC_PAYMASTER_RPC
) {
  throw new Error("BUNDLER_RPC or PAYMASTER_RPC is not set");
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
export const createKernel = async (walletClient: any, chain: Chain) => {
  console.log("createKernel");
  console.log(walletClient);

  const signer = walletClientToSmartAccountSigner(walletClient!);

  const sessionKeySigner = await toECDSASigner({
    signer,
  });

  const ecdsaValidator = await signerToEcdsaValidator(publicClient, {
    signer: signer,
    entryPoint,
  });

  // const callPolicy = toCallPolicy({
  //   permissions: [
  //     {
  //       target: zeroAddress,
  //       valueLimit: BigInt(0),
  //       abi: ERC20TransferFunctionABI,
  //       functionName: "transfer",
  //       args: [
  //         {
  //           condition: ParamCondition.EQUAL,
  //           value: masterAccount.address
  //         },
  //       ]
  //     },
  //   ],
  // });

  // const sessionKeyValidator = await toPermissionValidator(publicClient, {
  //   entryPoint,
  //   signer: sessionKeySigner,
  //   policies: [callPolicy],
  // });

  const account = await createKernelAccount(publicClient, {
    plugins: {
      sudo: ecdsaValidator,
      // regular: sessionKeyValidator,
    },
    entryPoint,
  });
  console.log("My account:", account.address);

  const kernelClient = createKernelAccountClient({
    account,
    entryPoint,
    chain,
    bundlerTransport: http(process.env.NEXT_PUBLIC_BUNDLER_RPC),
    middleware: {
      sponsorUserOperation: async ({ userOperation }) => {
        const paymasterClient = createZeroDevPaymasterClient({
          chain,
          transport: http(process.env.NEXT_PUBLIC_PAYMASTER_RPC),
          entryPoint,
        });
        return paymasterClient.sponsorUserOperation({
          userOperation,
          entryPoint,
        });
      },
    },
  });

  console.log("created kernel client");
  const userOpHash = await kernelClient.sendUserOperation({
    userOperation: {
      callData: await account.encodeCallData({
        to: zeroAddress,
        value: BigInt(0),
        data: "0x",
      }),
    },
  });

  console.log("userOp hash:", userOpHash);

  const bundlerClient = kernelClient.extend(bundlerActions(entryPoint));
  const _receipt = await bundlerClient.waitForUserOperationReceipt({
    hash: userOpHash,
  });

  console.log("userOp completed");
  console.log(_receipt);
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
