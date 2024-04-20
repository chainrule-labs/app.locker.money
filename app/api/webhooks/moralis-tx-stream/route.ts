"use server";

import { transferOnUserBehalf } from "@/lib/zerodev-server";
import { lockers, transactions } from "db/schema";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import process from "process";
import { Resend } from "resend";
import { formatUnits } from "viem";
import { sendDepositReceivedEmail } from "./email";

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

  // Native ETH
  for (const tx of res.txs) {
    console.log("Processing posslble ETH transfer", tx);

    const { hash, toAddress, fromAddress, value } = tx;

    // Only process positive & non-zero value ETH transactions
    if (parseFloat(value) <= 0) break;

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

    const amount = formatUnits(value, 18);
    const newTx = {
      hash,
      chainId: chainId.toString(),
      fromAddress,
      toAddress,
      timestamp: blockAt,
      tokenAddress: "0x",
      tokenName: "Native ETH",
      tokenSymbol: "ETH",
      amount,
      amountRaw: value,
      lockerId: locker.id,
    };

    // insert tx into DB
    await db.insert(transactions).values(newTx);

    // Trigger locker to move funds if it has already been deployed
    // FIXME: Incorrectly assuming all payments to locker will be on the same chain
    const shouldTriggerAutoSave = !!locker.encryptedSessionKey;
    if (shouldTriggerAutoSave) {
      await transferOnUserBehalf(newTx);
    }

    await sendDepositReceivedEmail({ locker, tx: newTx });
  }

  // ERC20
  for (const tx of res.erc20Transfers) {
    console.log("Processing erc20 transfer", tx);

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

    // insert tx into DB
    await db.insert(transactions).values(newTx);

    // Trigger locker to move funds if it has already been deployed
    // FIXME: Incorrectly assuming all payments to locker will be on the same chain
    const shouldTriggerAutoSave = !!locker.encryptedSessionKey;
    if (shouldTriggerAutoSave) {
      await transferOnUserBehalf(newTx);
    }

    await sendDepositReceivedEmail({ locker, tx: newTx });
  }

  return Response.json({ done: true });
}

/////////////////////////////////////////////////////////////////////////////////
// Sample payload: ETH
/*
{
  confirmed: false,
  chainId: '0xaa36a7',
  abi: [
    {
      name: 'Transfer',
      type: 'event',
      anonymous: false,
      inputs: [Array]
    }
  ],
  streamId: '0755a037-14fa-49b5-bbfb-fc0229743c6d',
  tag: 'lockerTxs',
  retries: 0,
  block: {
    number: '5739324',
    hash: '0x44de97065b470baf05b7b78ba9da9798f2254c648ed7a6b72b7d95cd2516c3f4',
    timestamp: '1713622680'
  },
  logs: [],
  txs: [
    {
      hash: '0x161e54c004540ca5b4656c3f9080ce91acd315ff2865c11201c010c811a4a736',
      gas: '41226',
      gasPrice: '2000502950',
      nonce: '9',
      input: '0x',
      transactionIndex: '14',
      fromAddress: '0xc1be6f9c2848652251c35e1cb655933f860f632c',
      toAddress: '0x69fea61d9ebd983a79b723cf3eed43f070090e10',
      value: '100000000000000',
      type: '2',
      v: '0',
      r: '104446858941015569590572778635298399706936796865920272777915664382722660666900',
      s: '13369914249161121047787924728554302442758714852217084004986604109597311781438',
      receiptCumulativeGasUsed: '571932',
      receiptGasUsed: '27139',
      receiptContractAddress: null,
      receiptRoot: null,
      receiptStatus: '1',
      triggered_by: [Array]
    }
  ],
  txsInternal: [],
  erc20Transfers: [],
  erc20Approvals: [],
  nftTokenApprovals: [],
  nftApprovals: { ERC721: [], ERC1155: [] },
  nftTransfers: [],
  nativeBalances: []
}
*/

/////////////////////////////////////////////////////////////////////////////////
// Sample payload: ERC20
/* {
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
*/

/////////////////////////////////////////////////////////////////////////////////
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
