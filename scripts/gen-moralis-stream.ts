// We use Moralis for listening to on-chain events
// One stream is created for all addresses we want to
import dotenv from "dotenv";
import Moralis from "moralis";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env.development.local") });

const chains = [
  // sepolia
  "0xaa36a7",
];

const description = "Locker transactions stream";
const tag = "locker_transactions_stream";

const createStream = async () => {
  console.log("Starting Moralis");
  await Moralis.start({
    apiKey: process.env.MORALIS_API_KEY,
  });

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
  const streamId = response.toJSON().id;

  const ERC20TransferABI = [
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          name: "from",
          type: "address",
        },
        {
          indexed: true,
          name: "to",
          type: "address",
        },
        {
          indexed: false,
          name: "value",
          type: "uint256",
        },
      ],
      name: "Transfer",
      type: "event",
    },
  ];

  const topic = "Transfer(address,address,uint256)";

  const updateResponse = await Moralis.Streams.update({
    id: streamId,
    abi: ERC20TransferABI,
    includeContractLogs: true,
    topic0: [topic],
  });

  console.log("Stream updated to listen for ERC20");
  console.log(response.toJSON());
};

createStream();
