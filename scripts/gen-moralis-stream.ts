// We use Moralis for listening to on-chain events
// One stream is created for all addresses we want to
import { ERC20TransferEventABI } from "@/abis/erc20-transfer-event";
import dotenv from "dotenv";
import Moralis from "moralis";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env.development.local") });

// https://docs.moralis.io/supported-chains
const chains = [
  // sepolia - 11155111
  "0xaa36a7",

  // arbitrum sepolia - 421614
  "0x66eee",

  // base sepolia - 84532
  "0x14a34",

  // linea sepolia - 59141
  "0xe705",

  // gnosis mainnet - 100
  "0x64",
];

const description = "Locker transactions stream";
const tag = "locker_transactions_stream";

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

  console.log("Stream updated to listen for ERC20");
  console.log(updateResponse.toJSON());
};

const createAndUpdateStream = async () => {
  await Moralis.start({
    apiKey: process.env.MORALIS_API_KEY,
  });

  const streamId = await createStream();
  await updateStream(streamId);
  // await updateStream();
};

createAndUpdateStream();
