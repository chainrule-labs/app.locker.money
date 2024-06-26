"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { copyToClipboard, truncateAddress } from "@/lib/utils";
import { useAuth, useClerk } from "@clerk/nextjs";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import { PiCheckSquareOffset, PiCopy } from "react-icons/pi";
import { useAccount, useBalance, useDisconnect } from "wagmi";

const AuthDropdown: FC = () => {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();
  const { signOut, openSignUp } = useClerk();
  const { isConnected, address, chain } = useAccount();
  const { disconnect } = useDisconnect();
  const [copied, setCopied] = useState<boolean>(false);

  const { openConnectModal } = useConnectModal();
  const { data } = useBalance({
    address: address,
  });

  const openUserProfile = () => {
    router.push("/user-profile");
  };

  if (!isLoaded)
    return (
      <Button disabled={true} aria-disabled={true} className="animate-pulse">
        Loading
      </Button>
    );

  return (
    <>
      {isLoaded && isSignedIn && isConnected ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary">
              <HamburgerMenuIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <span className="relative flex items-center rounded-sm px-2 py-1.5 text-sm text-zinc-300 outline-none transition-colors focus:bg-zinc-100 focus:text-zinc-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:focus:bg-zinc-700 dark:focus:text-zinc-50">
                {chain?.name}
              </span>
              <span className="relative flex items-center rounded-sm px-2 py-1.5 text-sm text-zinc-300 outline-none transition-colors focus:bg-zinc-100 focus:text-zinc-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:focus:bg-zinc-700 dark:focus:text-zinc-50">
                {parseFloat(data?.formatted as string).toFixed(7)}{" "}
                {data?.symbol}
              </span>
              <button
                className="relative flex cursor-pointer select-none items-center space-x-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-zinc-700 focus:bg-zinc-100 focus:text-zinc-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:focus:bg-zinc-700 dark:focus:text-zinc-50"
                onClick={() => copyToClipboard(address as string, setCopied)}
              >
                <span>{truncateAddress(address as `0x${string}`)}</span>
                {copied ? (
                  <PiCheckSquareOffset className="text-emerald-500" />
                ) : (
                  <PiCopy />
                )}
              </button>
              <DropdownMenuItem
                className="cursor-pointer"
                onSelect={() => openUserProfile()}
              >
                Manage Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onSelect={() => {
                  disconnect();
                  signOut(() => router.push("/"));
                }}
              >
                Sign out
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : isLoaded && isSignedIn && !isConnected ? (
        <Button variant="default" onClick={() => openConnectModal!()}>
          Connect Wallet
        </Button>
      ) : (
        <Button variant="default" onClick={() => openSignUp()}>
          Sign in
        </Button>
      )}
    </>
  );
};

export default AuthDropdown;
