"use client";

import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

import { CHAIN } from "@constants/chains";
import { env } from "env.mjs";

const { chains, provider } = configureChains(
  [CHAIN],
  [
    alchemyProvider({ apiKey: env.NEXT_PUBLIC_ALCHEMY_API_KEY }),
    publicProvider(),
  ],
);

const { connectors } = getDefaultWallets({
  appName: "Web3 Boilerplate",
  chains,
});

const client = createClient({
  autoConnect: true,
  connectors,
  provider,
  persister: null,
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig client={client}>
        <RainbowKitProvider chains={chains}>
          <ThemeProvider>{children}</ThemeProvider>
        </RainbowKitProvider>
      </WagmiConfig>
    </QueryClientProvider>
  );
}
