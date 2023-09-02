import { celoAlfajores, goerli, hardhat, polygon } from "wagmi/chains";

import HardhatIcon from "@icons/hardhat.svg";
import PolygonIcon from "@icons/polygon.svg";
import { env } from "env.mjs";

export type ChainMap = { [chainId: number]: string };

const getChains = () => {
  switch (env.NEXT_PUBLIC_CHAIN) {
    case "localhost":
      return [hardhat, goerli, celoAlfajores];
    case "testnet":
      return [goerli, celoAlfajores];
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
};
