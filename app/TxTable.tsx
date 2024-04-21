import {
  SUPPORTED_CHAIN_EXPLORERS,
  SUPPORTED_CHAIN_NAMES,
} from "@/lib/constants";
import { copyToClipboard, truncateAddress } from "@/lib/utils";
import { useState } from "react";
import { LiaExternalLinkAltSolid } from "react-icons/lia";
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

const TxTable = ({ txList }: { txList: Tx[] }) => {
  const [copiedItem, setCopiedItem] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  return (
    <div className="flex w-full flex-col overflow-x-auto rounded-sm ring-1 ring-zinc-700">
      <table className="min-w-full divide-y divide-zinc-700">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-zinc-400">
              Date
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-zinc-400">
              Chain
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-zinc-400">
              Token
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-zinc-400">
              Amt Received
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-zinc-400">
              Amt Saved
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-zinc-400">
              TX Hash
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-zinc-400">
              Sender
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-700">
          {txList.map((tx) => (
            <tr key={tx.hash}>
              <td className="whitespace-nowrap px-4 py-2 text-sm text-zinc-300">
                {tx.date}
              </td>
              <td className="whitespace-nowrap px-4 py-2 text-sm text-zinc-300">
                {SUPPORTED_CHAIN_NAMES[Number(tx?.chainId)]}
              </td>
              <td className="whitespace-nowrap px-4 py-2 text-sm text-zinc-300">
                {tx.tokenSymbol}
              </td>
              <td className="whitespace-nowrap px-4 py-2 text-sm text-zinc-300">
                {tx.amountDeposited}
              </td>
              <td className="whitespace-nowrap px-4 py-2 text-sm text-zinc-300">
                {tx.amountSaved}
              </td>
              <td className="whitespace-pre-wrap px-4 py-2 text-sm text-zinc-300">
                <a
                  className="flex underline outline-none hover:text-[#515EF1]"
                  href={`${SUPPORTED_CHAIN_EXPLORERS[Number(tx?.chainId)]}/tx/${tx.hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <code>{truncateAddress(tx.hash as `0x${string}`)}</code>
                  <LiaExternalLinkAltSolid className="ml-2" size="18px" />
                </a>
              </td>
              <td className="whitespace-nowrap px-4 py-2 text-sm text-zinc-300">
                <button
                  className="flex underline outline-none hover:text-[#515EF1]"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCopiedItem(tx.hash);
                    copyToClipboard(tx.from, setCopied);
                  }}
                >
                  <code>{truncateAddress(tx.from as `0x${string}`)}</code>
                  {copied && copiedItem === tx.hash ? (
                    <PiCheckSquareOffset
                      className="ml-2 text-emerald-500"
                      size="18px"
                    />
                  ) : (
                    <PiCopy className="ml-2" size="18px" />
                  )}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TxTable;
