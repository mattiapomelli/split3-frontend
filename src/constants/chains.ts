import { celoAlfajores, goerli, hardhat, polygon } from "wagmi/chains";

import HardhatIcon from "@icons/hardhat.svg";
import PolygonIcon from "@icons/polygon.svg";
import { env } from "env.mjs";

export type ChainMap = { [chainId: number]: string };

export const mantleTestnet = {
  id: 5001,
  name: "Mantle",
  network: "mantle-testnet",
  nativeCurrency: {
    decimals: 18,
    name: "Bit",
    symbol: "BIT",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.testnet.mantle.xyz"],
    },
    public: {
      http: ["https://rpc.testnet.mantle.xyz"],
    },
  },
};

const getChains = () => {
  switch (env.NEXT_PUBLIC_CHAIN) {
    case "localhost":
      return [hardhat, goerli, celoAlfajores, mantleTestnet];
    case "testnet":
      return [goerli, celoAlfajores, mantleTestnet];
    case "mainnet":
      throw [polygon];
    default:
      throw new Error("Invalid NEXT_PUBLIC_CHAIN value");
  }
};

export const CHAINS = getChains();

type Icon = (className: { className?: string }) => JSX.Element;

export const CHAIN_ICON: { [chainId: number]: Icon } = {
  [hardhat.id]: HardhatIcon,
  [goerli.id]: PolygonIcon,
  [polygon.id]: PolygonIcon,
  [celoAlfajores.id]: PolygonIcon,
  [mantleTestnet.id]: PolygonIcon,
};
