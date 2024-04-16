import {
  getKernelAddressFromECDSA,
  signerToEcdsaValidator,
} from "@zerodev/ecdsa-validator";
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
const ENTRYPOINT_V6 = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";

export const createKernel = async (walletClient: any, chain: Chain) => {
  console.log("createKernel");
  console.log(walletClient);

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

export const getSmartAccountAddress = async (address: string | undefined) => {
  if (!address) return null;

  const smartAccountAddress = await getKernelAddressFromECDSA({
    publicClient,
    eoaAddress: address as `0x${string}`,
    index: BigInt(DEFAULT_ZERODEV_SEED),
    // v6 entrypoint address, should be the same on most chains
    entryPointAddress: ENTRYPOINT_V6, // ECDSA_VALIDATOR_ADDRESS_V06,
  });

  return smartAccountAddress;
};
