import { ethers } from "ethers";

import { GroupAbi } from "@abis/group";
import { SplitWiseGroup } from "@abis/types/group";

export const getGroupContract = (address: string, signer: ethers.Signer) => {
  return new ethers.Contract(address, GroupAbi, signer) as SplitWiseGroup;
};
