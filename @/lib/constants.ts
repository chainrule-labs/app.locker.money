export const DEFAULT_SAVINGS_FACTOR = "0.2";
export const DEFAULT_ZERODEV_SEED =
  process.env.DEFAULT_ZERODEV_SEED || "639875";
export const PROVIDER_ZERODEV = "zerodev";

// Subset of Moralis + ZeroDev supported chains
// https://docs.moralis.io/supported-chains
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
