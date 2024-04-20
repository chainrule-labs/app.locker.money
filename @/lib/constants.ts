import { ENTRYPOINT_ADDRESS_V07 } from "permissionless";

export const DEFAULT_SAVINGS_FACTOR = "0.2";
export const DEFAULT_ZERODEV_SEED =
  process.env.NEXT_PUBLIC_DEFAULT_ZERODEV_SEED || "639875";
export const PROVIDER_ZERODEV = "zerodev";

// Subset of Moralis + ZeroDev supported chains
// https://docs.moralis.io/supported-chains
// https://docs.zerodev.app/sdk/faqs/chains#supported-networks
export const SUPPORTED_CHAINS = [
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

export const SUPPORTED_CHAIN_NAMES: { [key: number]: string } = {
  "84532": "Base Sepolia",
  "59141": "Linea Sepolia",
  "421614": "Arbitrum Sepolia",
  "100": "Gnosis Chain",
};

export const ENTRYPOINT = ENTRYPOINT_ADDRESS_V07;
