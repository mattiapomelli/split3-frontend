import { ethers } from "ethers";

import { GroupAbi } from "@abis/group";

export const getGroupContract = (address: string, signer: ethers.Signer) => {
  return new ethers.Contract(address, GroupAbi, signer);
};
