"use server";

import { clerkClient } from "@clerk/nextjs";
import { lockers, transactions } from "db/schema";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import process from "process";
import { Resend } from "resend";

// TODO: monitor native token TXs too
// https://moralis.io/how-to-monitor-all-eth-transfer-transactions/

const resend = new Resend(process.env.RESEND_API_KEY);
/**
 * Invoked whenever a new transaction is detected by Moralis.
 *      1) Filter for confirmed: false
 *      1) To address is the Locker address
 *      1) Check DB to confirm the transaction is not already processed
 *      2) If not processed, process it
 *      3) If processed, ignore the transaction
 *
 * If processing the transaction:
 *      1) Save tx to DB
 *      2) Notify user via email, with link to tx details
 * 
 * Sample payload:
 * {
  confirmed: false,
  chainId: '0xaa36a7',
  abi: [
    {
      anonymous: false,
      inputs: [Array],
      name: 'Transfer',
      type: 'event'
    }
  ],
  streamId: '0755a037-14fa-49b5-bbfb-fc0229743c6d',
  tag: 'locker_transactions_stream',
  retries: 0,
  block: {
    number: '5713300',
    hash: '0x17174de6e84c1a8d78946a202f605703104646cd932b1dc4ae2dbbe5a23af63a',
    timestamp: '1713302148'
  },
  logs: [
    {
      logIndex: '60',
      transactionHash: '0xee6ea2562c609b5143692451b11b16488ac5bcc1d5430ac4845510513726735a',
      address: '0xfff9976782d46cc05630d1f6ebab18b2324d6b14',
      data: '0x000000000000000000000000000000000000000000000000000000174876e800',
      topic0: '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
      topic1: '0x000000000000000000000000f650429129ab74d1f2b647cd1d7e3b022f26181d',
      topic2: '0x000000000000000000000000614406b955abd0797945badf3d8e890ab85723fb',
      topic3: null,
      triggered_by: [Array]
    }
  ],
  txs: [
    {
      hash: '0xee6ea2562c609b5143692451b11b16488ac5bcc1d5430ac4845510513726735a',
      gas: '52243',
      gasPrice: '1500443500',
      nonce: '18',
      input: '0xa9059cbb000000000000000000000000614406b955abd0797945badf3d8e890ab85723fb000000000000000000000000000000000000000000000000000000174876e800',
      transactionIndex: '45',
      fromAddress: '0xf650429129ab74d1f2b647cd1d7e3b022f26181d',
      toAddress: '0xfff9976782d46cc05630d1f6ebab18b2324d6b14',
      value: '0',
      type: '2',
      v: '0',
      r: '103700873731177040420514073429661925012145625457050003797663653252122366337645',
      s: '17054028290029081517627299868376790025841372696387000571904358411846752788623',
      receiptCumulativeGasUsed: '9452380',
      receiptGasUsed: '34470',
      receiptContractAddress: null,
      receiptRoot: null,
      receiptStatus: '1',
      triggered_by: [Array]
    }
  ],
  txsInternal: [],
  erc20Transfers: [
    {
      transactionHash: '0xee6ea2562c609b5143692451b11b16488ac5bcc1d5430ac4845510513726735a',
      logIndex: '60',
      contract: '0xfff9976782d46cc05630d1f6ebab18b2324d6b14',
      triggered_by: [Array],
      from: '0xf650429129ab74d1f2b647cd1d7e3b022f26181d',
      to: '0x614406b955abd0797945badf3d8e890ab85723fb',
      value: '100000000000',
      tokenName: 'Wrapped Ether',
      tokenSymbol: 'WETH',
      tokenDecimals: '18',
      valueWithDecimals: '1e-7',
      possibleSpam: false
    }
  ],
  erc20Approvals: [],
  nftTokenApprovals: [],
  nftApprovals: { ERC721: [], ERC1155: [] },
  nftTransfers: [],
  nativeBalances: []
}
 *
 * @param request
 * @returns
 */
export async function POST(request: Request) {
  console.log("moralis-tx-stream");
  const res = await request.json();
  console.log(res);

  // Filter for confirmed: false
  // We will err on the side of confirming too soon
  const {
    confirmed,
    chainId: chainIdHex,
    block: { timestamp },
  } = res;
  const chainId = parseInt(chainIdHex, 16);
  const blockAt = new Date(parseInt(timestamp) * 1000);

  if (confirmed) return Response.json({ done: true });

  // if locker already exists, return
  const client = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
  const db = drizzle(client);

  for (const tx of res.erc20Transfers) {
    console.log("Processing tx", tx);

    const {
      transactionHash: hash,
      to: toAddress,
      from: fromAddress,
      tokenName,
      tokenSymbol,
      possibleSpam,
      value: amountRaw,
      valueWithDecimals: amount,
      contract,
    } = tx;

    // Ignore spam tokens
    if (possibleSpam) break;
    console.log("Not spam");

    // To address is a known Locker address
    const existingLockers = await db
      .select()
      .from(lockers)
      .where(eq(lockers.lockerAddress, toAddress.toLowerCase()));

    if (existingLockers.length < 1) break;
    console.log("Existing lockers");

    // Check DB to confirm the transaction is not already processed
    const existingTxs = await db
      .select()
      .from(transactions)
      .where(eq(transactions.hash, hash.toLowerCase()));

    if (existingTxs.length > 0) break;
    console.log("No existing tx");
    const locker = existingLockers[0];

    const newTx = {
      hash,
      chainId: chainId.toString(),
      fromAddress,
      toAddress,
      timestamp: blockAt,
      tokenAddress: contract,
      tokenName,
      tokenSymbol,
      amount,
      amountRaw,
      lockerId: locker.id,
    };

    const supportedChains: { [key: number]: string } = {
      "84532": "Base Sepolia",
      "59141": "Linea Sepolia",
      "421614": "Arbitrum Sepolia",
      "100": "Gnosis Chain",
    };

    const chainName = supportedChains[chainId];

    const insertedTxs = await db
      .insert(transactions)
      .values(newTx)
      .returning({ insertedTxHash: transactions.hash });
    // TODO trigger locker to move funds if it has already been deployed

    const { userId } = locker;
    // Update metadata with Locker information
    const user = await clerkClient.users.getUser(userId);
    console.log("User", user);

    const amountStr = `${amount} ${tokenSymbol}`;
    const link = `${process.env.API_HOST}/tx/${insertedTxs[0].insertedTxHash}`;
    const to = user.emailAddresses[0].emailAddress;
    const emailHTML = `<div style="font-family: Arial, sans-serif; color: #333; text-align: start; background-color: #F7F7F7; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
      <img src="${process.env.API_HOST}/iconLockerTransOvals.svg" alt="Locker Logo" style="width: 100px; height: auto; margin-bottom: 20px;">
      <h2 style="color: #4C4FE4;">Update on Your Locker Transaction</h2>
      <p>Your locker with address ${toAddress} just received ${amountStr} on the ${chainName} network.</p>
      <a href="${link}" style="color: #2AAAD9; text-decoration: none; font-weight: bold; display: inline-block; margin-top: 20px; padding: 10px 15px; background-color: #4C4FE4; border-radius: 4px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);">Go to your Locker dashboard</a>
      <hr style="border-color: #E5E5E5; border-style: solid; border-width: 1px 0 0;">
      <p style="font-size: small; color: #666;">You received this email because you are registered with Locker. If you believe this was an error, please <a href="mailto:support@chainrule.io" style="color: #4C4FE4;">contact us</a>.</p>
    </div>
  </div>`;
    await resend.emails.send({
      from: "Locker <contact@noreply.locker.money>",
      to,
      subject: `Received ${amountStr} in Locker`,
      html: emailHTML,
    });

    console.log("Email sent to " + to);
  }

  return Response.json({ done: true });
}

// Endpoint testing
/*
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
  "confirmed": false,
  "chainId": "0xaa36a7",
  "block": {
    "number": "5713300",
    "hash": "0x17174de6e84c1a8d78946a202f605703104646cd932b1dc4ae2dbbe5a23af63a",
    "timestamp": "1713302148"
  },
  "txs": [
    {
      "hash": "0xee6ea2562c609b5143692451b11b16488ac5bcc1d5430ac4845510513726735a",
      "gas": "52243",
      "gasPrice": "1500443500",
      "nonce": "18",
      "input": "0xa9059cbb000000000000000000000000614406b955abd0797945badf3d8e890ab85723fb000000000000000000000000000000000000000000000000000000174876e800",
      "transactionIndex": "45",
      "fromAddress": "0xf650429129ab74d1f2b647cd1d7e3b022f26181d",
      "toAddress": "0xfff9976782d46cc05630d1f6ebab18b2324d6b14",
      "value": "0",
      "type": "2",
      "v": "0",
      "r": "103700873731177040420514073429661925012145625457050003797663653252122366337645",
      "s": "17054028290029081517627299868376790025841372696387000571904358411846752788623",
      "receiptCumulativeGasUsed": "9452380",
      "receiptGasUsed": "34470",
      "receiptContractAddress": null,
      "receiptRoot": null,
      "receiptStatus": "1"
    }
  ],
  "erc20Transfers": [
    {
      "transactionHash": "0xee6ea2562c609b5143692451b11b16488ac5bcc1d5430ac4845510513726735a",
      "logIndex": "60",
      "contract": "0xfff9976782d46cc05630d1f6ebab18b2324d6b14",
      "from": "0xf650429129ab74d1f2b647cd1d7e3b022f26181d",
      "to": "0xAF98E80b40817f08D28e00dbdDdE8a4958713037",
      "value": "100000000000",
      "tokenName": "Wrapped Ether",
      "tokenSymbol": "WETH",
      "tokenDecimals": "18",
      "valueWithDecimals": "1e-7",
      "possibleSpam": false
    }
  ]
}' \
  http://localhost:3000/api/webhooks/moralis-tx-stream
*/
