"use client";

import { useAccount } from "wagmi";

import { Logo } from "@components/basic/logo";
import { ThemeToggle } from "@components/basic/theme-toggle";
import { ChainSwitch } from "@components/chain-switch";

import { WalletStatus } from "../wallet/wallet-status";

import { Container } from "./container";

export const Navbar = () => {
  const { isConnecting, isReconnecting } = useAccount();

  return (
    <header className="flex h-20 items-center" suppressHydrationWarning>
      <Container className="flex w-full items-center justify-between">
        <Logo />
        {!isReconnecting && !isConnecting && (
          <div className="animate-in fade-in flex items-center gap-4 duration-100">
            <ThemeToggle />
            <ChainSwitch />
            <WalletStatus />
          </div>
        )}
      </Container>
    </header>
  );
};
