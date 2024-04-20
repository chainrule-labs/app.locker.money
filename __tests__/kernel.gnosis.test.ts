import {
  getKernelAddressFromECDSA,
  signerToEcdsaValidator,
} from "@zerodev/ecdsa-validator";
import { createKernelAccount } from "@zerodev/sdk";
import dotenv from "dotenv";
import path from "path";
import { ENTRYPOINT_ADDRESS_V07 } from "permissionless";
import { Hex, createPublicClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";

dotenv.config({ path: path.resolve(__dirname, "../.env.development.local") });
const entryPoint = ENTRYPOINT_ADDRESS_V07;

// 79b2b13cac543fd9b9e2f281e2d963a2f0794ea751d75d4dafca8c40a0e39680
const eoaAddress = "0xAed0B2b76f88b3A6da76F549fa9a0cFfB8634868";

const publicClient = createPublicClient({
  transport: http(process.env.NEXT_PUBLIC_BUNDLER_RPC_GNOSIS),
});

test("kernel creation on gnosis", async () => {
  const seed = "123";
  const addressFromEcdsa = await getKernelAddressFromECDSA({
    publicClient,
    eoaAddress,
    index: BigInt(seed),
    entryPointAddress: entryPoint,
  });

  const signer = privateKeyToAccount(
    "0x79b2b13cac543fd9b9e2f281e2d963a2f0794ea751d75d4dafca8c40a0e39680" as Hex,
  );

  const ecdsaValidator = await signerToEcdsaValidator(publicClient, {
    signer: signer,
    entryPoint,
  });

  const account = await createKernelAccount(publicClient, {
    index: BigInt(seed),
    plugins: {
      sudo: ecdsaValidator,
    },
    entryPoint,
  });

  console.log("Generated address:", addressFromEcdsa);
  console.log("Kernel account:", account.address);
  expect(account.address).toEqual(addressFromEcdsa);
});
