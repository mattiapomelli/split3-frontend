import { hardhat, polygon, polygonMumbai } from "wagmi/chains";

import { ChainMap } from "./chains";

export const GROUP_ADDRESS: ChainMap = {
  [hardhat.id]: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  [polygonMumbai.id]: "",
  [polygon.id]: "'",
};
