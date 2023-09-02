import { celoAlfajores, goerli, hardhat, polygon } from "wagmi/chains";

import { mantleTestnet } from "./chains";

export const EXPLORER_URL: Record<number, string> = {
  [polygon.id]: "https://polygonscan.com",
  [goerli.id]: "https://goerli.etherscan.com",
  [hardhat.id]: "",
  [celoAlfajores.id]: "https://explorer.celo.org/alfajores/address",
  [mantleTestnet.id]: "https://explorer.testnet.mantle.xyz/address",
};

export const getAddressExplorerLink = (chainId: number, address: string) => {
  return `${EXPLORER_URL[chainId]}/address/${address}`;
};

// export const RPC_URL: Record<number, string> = {
//   [polygon.id]: `https://polygon-mainnet.g.alchemy.com/v2/${env.NEXT_PUBLIC_ALCHEMY_API_KEY}`,
//   [polygonMumbai.id]: `https://polygon-mumbai.g.alchemy.com/v2/${env.NEXT_PUBLIC_ALCHEMY_API_KEY}`,
//   [hardhat.id]: "http://localhost:8545",
// };
