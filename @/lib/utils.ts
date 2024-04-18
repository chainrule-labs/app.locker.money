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
  var parts = name.split(" ");
  var initials = "";
  for (var i = 0; i < parts.length; i++) {
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
