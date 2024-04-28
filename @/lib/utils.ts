import clsx, { ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/** Handles concatenation and merging of tailwind classes */
export function cn(...inputs: ClassValue[]): string {
  return customTwMerge(clsx(...inputs));
}

const customTwMerge = extendTailwindMerge({
  override: {
    theme: {
      spacing: ["token", "base", "footer", "row"],
      colors: [
        "accent",
        "danger",
        "selected",
        "edit",
        "active",
        "related",
        "success",
        "error",
      ],
    },
  },
});

export const getInitials = (name: string): string => {
  const parts = name.split(" ");
  let initials = "";
  for (let i = 0; i < parts.length; i++) {
    if (parts[i].length > 0 && parts[i] !== "") {
      initials += parts[i][0];
    }
  }
  return initials;
};

export const copyToClipboard = (
  text: string,
  setCopied: (value: boolean) => void,
) => {
  navigator.clipboard.writeText(text).then(
    () => {
      setCopied(true);
      // Change back to default state after 2 seconds.
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    },
    (err) => {
      // eslint-disable-next-line no-console
      console.error("Failed to Copy", err.message);
    },
  );
};

export const truncateAddress = (address: `0x${string}`): string => {
  if (!address) return "No Account";
  const match = address.match(
    /^(0x[a-zA-Z0-9]{3})[a-zA-Z0-9]+([a-zA-Z0-9]{5})$/,
  );
  if (!match) return address;
  return `${match[1]}...${match[2]}`;
};

export const chainId2ZeroDevClientInfo = (chainId: string) => {
  switch (chainId.toString()) {
    // sepolia - 11155111
    case "11155111":
      return {
        rpc: process.env.NEXT_PUBLIC_BUNDLER_RPC_SEPOLIA,
        paymaster: process.env.NEXT_PUBLIC_PAYMASTER_RPC_SEPOLIA,
      };

    // arbitrum sepolia - 421614
    case "421614":
      return {
        rpc: process.env.NEXT_PUBLIC_BUNDLER_RPC_ARBITRUM_SEPOLIA,
        paymaster: process.env.NEXT_PUBLIC_PAYMASTER_RPC_ARBITRUM_SEPOLIA,
      };

    // base sepolia - 84532
    case "84532":
      return {
        rpc: process.env.NEXT_PUBLIC_BUNDLER_RPC_BASE_SEPOLIA,
        paymaster: process.env.NEXT_PUBLIC_PAYMASTER_RPC_BASE_SEPOLIA,
      };

    // linea sepolia - 59141
    case "59141":
      return {
        rpc: process.env.NEXT_PUBLIC_BUNDLER_RPC_LINEA_SEPOLIA,
        paymaster: process.env.NEXT_PUBLIC_PAYMASTER_RPC_LINEA_SEPOLIA,
      };

    // linea mainnet - 59144
    case "59144":
      return {
        rpc: process.env.NEXT_PUBLIC_BUNDLER_RPC_LINEA,
        paymaster: process.env.NEXT_PUBLIC_PAYMASTER_RPC_LINEA,
      };

    // gnosis mainnet - 100
    case "100":
      return {
        rpc: process.env.NEXT_PUBLIC_BUNDLER_RPC_GNOSIS,
        paymaster: process.env.NEXT_PUBLIC_PAYMASTER_RPC_GNOSIS,
      };

    default:
      throw new Error(`Unsupported chainId: ${chainId}`);
  }
};
