import { getKernelAddressFromECDSA } from "@zerodev/ecdsa-validator";
import { ENTRYPOINT_ADDRESS_V07 } from "permissionless";
import { createPublicClient, http } from "viem";

const entryPoint = ENTRYPOINT_ADDRESS_V07;

const eoaAddress = "0xAed0B2b76f88b3A6da76F549fa9a0cFfB8634868";
// const signer = privateKeyToAccount(
//   "79b2b13cac543fd9b9e2f281e2d963a2f0794ea751d75d4dafca8c40a0e39680" as Hex,
// );

test("kernel addresses are the same across chains", async () => {
  const publicClient = createPublicClient({
    // Use your RPC provider or bundler.
    // You can get this RPC from the ZeroDev dashboard.
    transport: http(process.env.NEXT_PUBLIC_BUNDLER_RPC),
  });

  const smartAccountAddress1 = await getKernelAddressFromECDSA({
    publicClient,
    eoaAddress,
    index: 0n,
    entryPointAddress: entryPoint,
  });

  const smartAccountAddress2 = await getKernelAddressFromECDSA({
    publicClient,
    eoaAddress,
    index: 0n,
    entryPointAddress: entryPoint,
  });

  expect(smartAccountAddress1).toEqual(smartAccountAddress2);
});
