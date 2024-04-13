import { signerToEcdsaValidator } from "@zerodev/ecdsa-validator";
import { createKernelAccount } from "@zerodev/sdk";
import { ENTRYPOINT_ADDRESS_V07 } from "permissionless";
import { SmartAccountSigner } from "permissionless/accounts";
import { createPublicClient, http } from "viem";
import { sepolia } from "viem/chains";

if (!process.env.BUNDLER_RPC || !process.env.PAYMASTER_RPC) {
  throw new Error("BUNDLER_RPC or PAYMASTER_RPC or PRIVATE_KEY is not set");
}

const publicClient = createPublicClient({
  transport: http(process.env.BUNDLER_RPC),
});

const chain = sepolia;
const entryPoint = ENTRYPOINT_ADDRESS_V07;

const createKernel = async (signer: SmartAccountSigner) => {
  const ecdsaValidator = await signerToEcdsaValidator(publicClient, {
    signer,
    entryPoint,
  });

  const account = await createKernelAccount(publicClient, {
    plugins: {
      sudo: ecdsaValidator,
    },
    entryPoint,
  });
  console.log("My account:", account.address);

  //   const kernelClient = createKernelAccountClient({
  //     account,
  //     entryPoint,
  //     chain,
  //     bundlerTransport: http(process.env.BUNDLER_RPC),
  //     middleware: {
  //       sponsorUserOperation: async ({ userOperation }) => {
  //         const paymasterClient = createZeroDevPaymasterClient({
  //           chain,
  //           transport: http(process.env.PAYMASTER_RPC),
  //           entryPoint,
  //         });
  //         return paymasterClient.sponsorUserOperation({
  //           userOperation,
  //           entryPoint,
  //         });
  //       },
  //     },
  //   });

  //   const userOpHash = await kernelClient.sendUserOperation({
  //     userOperation: {
  //       callData: await account.encodeCallData({
  //         to: zeroAddress,
  //         value: BigInt(0),
  //         data: "0x",
  //       }),
  //     },
  //   });

  //   console.log("userOp hash:", userOpHash);

  //   const bundlerClient = kernelClient.extend(bundlerActions(entryPoint));
  //   const _receipt = await bundlerClient.waitForUserOperationReceipt({
  //     hash: userOpHash,
  //   });

  console.log("userOp completed");
};
