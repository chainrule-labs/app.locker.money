"use client";

import { getPortfolio } from "@/lib/moralis";
import { copyToClipboard, truncateAddress } from "@/lib/utils";
import TxTable from "app/TxTable";
import { useEffect, useState } from "react";
import { PiCheckSquareOffset, PiCopy } from "react-icons/pi";

type Tx = {
  date: string;
  chainId: string;
  tokenSymbol: string;
  tokenAddr: string;
  amountDeposited: string;
  amountSaved: string;
  hash: string;
  from: string;
};

type LockerInfo = {
  address: string;
  savePercentage: string;
};

type TransactionData = {
  transactions: {
    id: number;
    hash: string;
    chainId: string;
    fromAddress: string;
    toAddress: string;
    timestamp: string;
    tokenAddress: string;
    tokenName: string;
    tokenSymbol: string;
    amount: string;
    amountRaw: string;
    lockerId: number;
  };
  lockers: {
    id: number;
    userId: string;
    seed: string;
    provider: string;
    ownerAddress: string;
    lockerAddress: string;
    createdAt: string;
    updatedAt: string;
    encryptedSessionKey: string;
    autosavePctRemainInLocker: string;
  };
};

const DashboardLockerPortfolio = ({
  transactions,
}: {
  transactions: TransactionData[];
}) => {
  const [lockerInfo, setLockerInfo] = useState<any>(null);
  const [txList, setTxList] = useState<any>(null);
  const [lockerUsdValue, setLockerUsdValue] = useState<string>("0.00");
  const [copied, setCopied] = useState<boolean>(false);

  const fetchPortfolio = async () => {
    if (lockerInfo) {
      const { netWorthUsd } = await getPortfolio(lockerInfo.address);
      setLockerUsdValue(netWorthUsd);
    }
  };

  useEffect(() => {
    fetchPortfolio();

    // Set the txList state
    const newTxList: Tx[] = transactions.map((txObj: TransactionData) => ({
      date: new Date(txObj.transactions.timestamp).toLocaleDateString(),
      chainId: txObj.transactions.chainId,
      tokenSymbol: txObj.transactions.tokenSymbol,
      tokenAddr: txObj.transactions.tokenAddress,
      amountDeposited: txObj.transactions.amount,
      amountSaved: (
        (parseFloat(txObj.transactions.amount) *
          parseFloat(txObj.lockers.autosavePctRemainInLocker)) /
        100
      ).toString(),
      hash: txObj.transactions.hash,
      from: txObj.transactions.fromAddress,
    }));
    setTxList(newTxList);

    // Set the lockerInfo state
    const newLockerInfo: LockerInfo = {
      address: transactions[0]?.lockers.lockerAddress,
      savePercentage: transactions[0]?.lockers.autosavePctRemainInLocker,
    };
    setLockerInfo(newLockerInfo);
  }, [transactions]);

  return (
    <div className="flex w-full flex-1 flex-col items-start justify-start p-4">
      <div className="mb-12 flex flex-col">
        <h1 className="mb-8 w-full text-4xl">Locker Portfolio</h1>
        <span className="mb-1 text-zinc-400">USD value</span>
        <span className="mb-8 text-3xl">${lockerUsdValue}</span>
        <span className="mb-1 text-lg">My locker</span>
        <button
          className="flex w-fit items-center justify-start text-left text-sm text-zinc-300 underline outline-none hover:text-[#515EF1]"
          onClick={() => copyToClipboard(lockerInfo.address, setCopied)}
        >
          <code>
            {lockerInfo && truncateAddress(lockerInfo.address as `0x${string}`)}
          </code>
          {copied ? (
            <PiCheckSquareOffset
              className="ml-3 shrink-0 text-emerald-500"
              size="18px"
            />
          ) : (
            <PiCopy className="ml-3 shrink-0" size="18px" />
          )}
        </button>
      </div>
      {txList ? (
        <>
          <span className="mb-1 text-lg">Transaction history</span>
          <TxTable txList={txList} />
        </>
      ) : null}
    </div>
  );
};

export default DashboardLockerPortfolio;
