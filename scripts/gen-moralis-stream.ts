// We use Moralis for listening to on-chain events
// One stream is created for all addresses we want to
import { ERC20TransferEventABI } from "@/abis/erc20-transfer-event";
import { SUPPORTED_CHAINS } from "@/lib/constants";
import dotenv from "dotenv";
import Moralis from "moralis";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env.development.local") });

const chains = SUPPORTED_CHAINS;

const description = "Locker transactions stream";
const tag = "lockerTxs";

const createStream = async () => {
  console.log("Starting Moralis");

  console.log("Moralis started");
  const host = process.env.API_HOST;

  const txUpdatePath = `api/webhooks/moralis-tx-stream`;
  const webhookUrl = `${host}/${txUpdatePath}`;
  console.log("webhookUrl", webhookUrl);
  const response = await Moralis.Streams.add({
    webhookUrl,
    description,
    tag,
    chains,
    includeNativeTxs: true,
  });

  console.log(JSON.stringify(response.toJSON(), null, 2));
  return response.toJSON().id;
};

const updateStream = async (
  streamId: string = "0755a037-14fa-49b5-bbfb-fc0229743c6d",
) => {
  console.log("updateStream", streamId);

  const topic = "Transfer(address,address,uint256)";
  const updateResponse = await Moralis.Streams.update({
    id: streamId,
    abi: ERC20TransferEventABI,
    chains,
    includeContractLogs: true,
    topic0: [topic],
  });

  console.log("Listening for ERC20 and native transfers...");
  console.log(updateResponse.toJSON());
};

const createAndUpdateStream = async () => {
  await Moralis.start({
    apiKey: process.env.MORALIS_API_KEY,
  });

  const streamId = await createStream();
  await updateStream(streamId);
};

createAndUpdateStream();
