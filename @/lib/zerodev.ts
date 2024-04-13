import { signerToEcdsaValidator } from "@zerodev/ecdsa-validator";
import { createKernelAccount, createKernelAccountClient } from "@zerodev/sdk";
import {
  ENTRYPOINT_ADDRESS_V07,
  bundlerActions,
  walletClientToSmartAccountSigner,
} from "permissionless";
import { Chain, createPublicClient, http, zeroAddress } from "viem";
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
    middleware: {},
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
