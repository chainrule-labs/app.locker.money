import { parseAbi } from "viem";
import {
  arbitrumSepolia,
  baseSepolia,
  gnosis,
  lineaSepolia,
  sepolia,
} from "viem/chains";

export const chainId2Chain = (chainId: string) => {
  switch (chainId.toString()) {
    // sepolia - 11155111
    case "11155111":
      return sepolia;

    // arbitrum sepolia - 421614
    case "421614":
      return arbitrumSepolia;

    // base sepolia - 84532
    case "84532":
      return baseSepolia;

    // linea sepolia - 59141
    case "59141":
      return lineaSepolia;

    // gnosis mainnet - 100
    case "100":
      return gnosis;

    default:
      throw new Error(`Unsupported chainId: ${chainId}`);
  }
};

export const ERC20_TRANSFER_ABI = parseAbi([
  "function transfer(address _to, uint256 _value) public",
]);
