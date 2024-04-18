import { parseAbi } from "viem";
import { sepolia } from "viem/chains";

export const chainId2Chain = (chainId: number) => {
  switch (chainId) {
    // sepolia - 11155111
    case 11155111:
      return sepolia;
    default:
      throw new Error(`Unsupported chainId: ${chainId}`);

    // // arbitrum sepolia - 421614
    // "0x66eee",

    // // base sepolia - 84532
    // "0x14a34",

    // // linea sepolia - 59141
    // "0xe705",

    // // gnosis mainnet - 100
    // "0x64",
  }
};

export const ERC20_TRANSFER_ABI = parseAbi([
  "function transfer(address _to, uint256 _value) public",
]);
