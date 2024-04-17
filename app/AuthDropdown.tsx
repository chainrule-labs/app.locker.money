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
import { useAuth, useClerk, useUser } from "@clerk/nextjs";
import { CheckIcon, CopyIcon, HamburgerMenuIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import { useAccount } from "wagmi";

const AuthDropdown: FC = () => {
  const router = useRouter();
  const { user } = useUser(); // undefined for some reason
  const { isLoaded, isSignedIn } = useAuth();
  const Clerk = useClerk();
  const { isConnected, address, chain } = useAccount();
  const [copied, setCopied] = useState<boolean>(false);

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
              <span className="relative flex items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-zinc-100 focus:text-zinc-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:focus:bg-zinc-700 dark:focus:text-zinc-50">
                {chain?.name}
              </span>
              <button
                className="relative flex cursor-default select-none items-center space-x-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-zinc-100 focus:text-zinc-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:focus:bg-zinc-700 dark:focus:text-zinc-50"
                onClick={() => copyToClipboard(address as string, setCopied)}
              >
                <span>{truncateAddress(address as `0x${string}`)}</span>
                {copied ? (
                  <CheckIcon className="text-emerald-500" />
                ) : (
                  <CopyIcon />
                )}
              </button>
              <DropdownMenuItem onSelect={() => openUserProfile()}>
                Manage Profile
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => Clerk.signOut()}>
                Sign out
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button variant="default" onClick={() => Clerk.openSignIn()}>
          Sign in
        </Button>
      )}
    </>
  );
};

export default AuthDropdown;
